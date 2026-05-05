import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, UserCheck, UserX, Shield } from 'lucide-react'
import { TURMA_LABELS, type Turma, type StatusMembro } from './constants'
import { calcularEstado } from './actions'
import { anoAtual, seguroAtivo, membroInativo } from '@/lib/membros-estado'
import SortSelect from './SortSelect'
import FilterSelect from './FilterSelect'
import SearchInput from './SearchInput'
import MembrosFiltersBar from './MembrosFiltersBar'
import { LinkSpinner } from '@/components/dashboard/PendingLink'
import MembrosTableClient, { type MembroRow } from './MembrosTableClient'

// ─── PÁGINA PRINCIPAL DE MEMBROS ──────────────────────────────
// Lista todos os sócios com o estado calculado dinamicamente:
//   ISENTO   → Admin marcou como isento (azul)
//   PAGO     → Mês atual pago (verde)
//   NÃO PAGO → Mês atual por pagar, mês anterior OK (amarelo)
//   INATIVO  → Mês anterior sem pagamento (vermelho)
export const metadata = { title: 'Membros | Dashboard' }

export default async function MembrosPage({
  searchParams,
}: {
  searchParams: Promise<{ turma?: string; q?: string; status?: string; seguro?: string; inspecao?: string; estado?: string; sort?: string; error?: string }>
}) {
  const searchParamsData = await searchParams
  const supabase = await createClient()

  // Buscar todos os membros com os seus pagamentos
  let query = supabase.from('membros').select(`
    *,
    pagamentos ( mes_referencia, data_pagamento, valor )
  `).order('nome', { ascending: true }) as any

  if (searchParamsData.turma) {
    query = query.eq('turma', searchParamsData.turma)
  }
  if (searchParamsData.q) {
    query = query.ilike('nome', `%${searchParamsData.q}%`)
  }

  const { data: membros } = await query

  // Quais membros têm inspeção médica enviada (derivado de document_metadata)
  const { data: inspecoes } = await (supabase
    .from('document_metadata')
    .select('membro_id')
    .eq('categoria', 'inspecao_medica') as any)
  const comInspecao = new Set<string>((inspecoes || []).map((r: any) => r.membro_id))

  // Avatars: pega o último upload com categoria='avatar' por membro e gera
  // signed URLs em batch (1 query para todos, evita N+1).
  const { data: avatarRows } = await (supabase
    .from('document_metadata')
    .select('membro_id, storage_path, uploaded_at')
    .eq('categoria', 'avatar')
    .order('uploaded_at', { ascending: false }) as any)
  // Manter só o avatar mais recente por membro
  const avatarPathByMembro = new Map<string, string>()
  for (const r of (avatarRows || []) as any[]) {
    if (!avatarPathByMembro.has(r.membro_id)) avatarPathByMembro.set(r.membro_id, r.storage_path)
  }
  const avatarPaths = Array.from(avatarPathByMembro.values())
  const avatarUrlByMembro = new Map<string, string>()
  if (avatarPaths.length > 0) {
    const { data: signed } = await supabase.storage
      .from('documentos')
      .createSignedUrls(avatarPaths, 60 * 60)  // 1h
    const urlByPath = new Map<string, string>()
    for (const s of (signed || []) as any[]) {
      if (s.signedUrl && s.path) urlByPath.set(s.path, s.signedUrl)
    }
    for (const [mid, path] of avatarPathByMembro) {
      const u = urlByPath.get(path)
      if (u) avatarUrlByMembro.set(mid, u)
    }
  }

  // Calcular o estado de cada membro segundo a nova lógica
  const membrosComStatus = await Promise.all((membros || []).map(async (m: any) => {
    const mesesPagos = (m.pagamentos || []).map((p: any) => p.mes_referencia)
    return {
      ...m,
      status: await calcularEstado(m) as StatusMembro,
      _inativo: membroInativo(m, mesesPagos),
      _inspecaoOk: comInspecao.has(m.id),
      _avatarUrl: avatarUrlByMembro.get(m.id) ?? null,
    }
  }))

  // Filtrar por estado se pedido
  let membrosFiltrados = searchParamsData.status
    ? membrosComStatus.filter((m: any) => m.status === searchParamsData.status)
    : membrosComStatus

  // Filtrar por estado do seguro (em_dia | em_falta)
  if (searchParamsData.seguro) {
    membrosFiltrados = membrosFiltrados.filter((m: any) => {
      const ok = seguroAtivo(m)
      return searchParamsData.seguro === 'em_dia' ? ok : !ok
    })
  }

  // Filtrar por inspeção médica (em_dia | em_falta)
  if (searchParamsData.inspecao) {
    membrosFiltrados = membrosFiltrados.filter((m: any) => {
      const ok = m._inspecaoOk
      return searchParamsData.inspecao === 'em_dia' ? ok : !ok
    })
  }

  // Filtrar por estado ativo/inativo
  if (searchParamsData.estado) {
    membrosFiltrados = membrosFiltrados.filter((m: any) =>
      searchParamsData.estado === 'inativo' ? m._inativo : !m._inativo
    )
  }

  // Ordenação
  const sort = searchParamsData.sort || 'nome_asc'
  const TURMA_SORT_ORDER: Turma[] = ['gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres']
  const turmaOrder = (t: string) => TURMA_SORT_ORDER.indexOf(t as Turma)
  membrosFiltrados = [...membrosFiltrados].sort((a: any, b: any) => {
    switch (sort) {
      case 'nome_desc': return b.nome.localeCompare(a.nome, 'pt')
      case 'turma_asc':  return turmaOrder(a.turma) - turmaOrder(b.turma) || a.nome.localeCompare(b.nome, 'pt')
      case 'turma_desc': return turmaOrder(b.turma) - turmaOrder(a.turma) || a.nome.localeCompare(b.nome, 'pt')
      case 'seguro_falta':    return Number(seguroAtivo(a)) - Number(seguroAtivo(b))
      case 'seguro_pago':     return Number(seguroAtivo(b)) - Number(seguroAtivo(a))
      case 'inspecao_falta':  return Number(a._inspecaoOk) - Number(b._inspecaoOk)
      case 'inspecao_feita':  return Number(b._inspecaoOk) - Number(a._inspecaoOk)
      case 'inativos_primeiro': return Number(b._inativo) - Number(a._inativo)
      default: return a.nome.localeCompare(b.nome, 'pt')
    }
  })

  // Contadores
  const totalPago = membrosComStatus.filter((m: any) => m.status === 'pago').length
  const totalNaoPago = membrosComStatus.filter((m: any) => m.status === 'nao_pago').length
  const totalInativo = membrosComStatus.filter((m: any) => m._inativo).length
  const totalIsento = membrosComStatus.filter((m: any) => m.status === 'isento').length

  const turmas: Turma[] = ['gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres']
  const ano = anoAtual()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-[#E8B55B] tracking-wider">
            Gestão de Membros
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {membrosComStatus.length} membro{membrosComStatus.length !== 1 ? 's' : ''} registado{membrosComStatus.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/membros/novo"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#E8B55B] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#C99C4A] shadow-[0_0_15px_rgba(232,181,91,0.3)] hover:shadow-[0_0_25px_rgba(232,181,91,0.6)] transition-all"
        >
          <Plus className="w-4 h-4" /> Novo Membro
          <LinkSpinner className="text-black" />
        </Link>
      </div>

      {/* Cartões de estado */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Link href="/dashboard/membros" className={`bg-[#121212] p-3 sm:p-4 rounded-2xl border transition-all ${!searchParamsData.status ? 'border-[#E8B55B]/30' : 'border-white/5 hover:border-white/10'}`}>
          <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mb-1">Total</p>
          <p className="text-xl sm:text-2xl font-bold text-[#E8B55B]">{membrosComStatus.length}</p>
        </Link>
        <Link href="/dashboard/membros?status=pago" className={`bg-[#121212] p-3 sm:p-4 rounded-2xl border transition-all ${searchParamsData.status === 'pago' ? 'border-green-400/30' : 'border-white/5 hover:border-white/10'}`}>
          <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><UserCheck className="w-3 h-3 text-green-400" /> Pagos</p>
          <p className="text-xl sm:text-2xl font-bold text-green-400">{totalPago}</p>
        </Link>
        <Link href="/dashboard/membros?status=nao_pago" className={`bg-[#121212] p-3 sm:p-4 rounded-2xl border transition-all ${searchParamsData.status === 'nao_pago' ? 'border-yellow-400/30' : 'border-white/5 hover:border-white/10'}`}>
          <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><UserX className="w-3 h-3 text-yellow-400" /> Não Pagos</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-400">{totalNaoPago}</p>
        </Link>
        <Link href="/dashboard/membros?estado=inativo" className={`bg-[#121212] p-3 sm:p-4 rounded-2xl border transition-all ${searchParamsData.estado === 'inativo' ? 'border-red-400/30' : 'border-white/5 hover:border-white/10'}`}>
          <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><UserX className="w-3 h-3 text-red-400" /> Inativos</p>
          <p className="text-xl sm:text-2xl font-bold text-red-400">{totalInativo}</p>
        </Link>
        <Link href="/dashboard/membros?status=isento" className={`bg-[#121212] p-3 sm:p-4 rounded-2xl border transition-all col-span-2 sm:col-span-1 ${searchParamsData.status === 'isento' ? 'border-blue-400/30' : 'border-white/5 hover:border-white/10'}`}>
          <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><Shield className="w-3 h-3 text-blue-400" /> Isentos</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-400">{totalIsento}</p>
        </Link>
      </div>

      {/* Barra de Pesquisa + Dropdowns de Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput initial={searchParamsData.q || ''} />
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <FilterSelect
          label="Turma"
          param="turma"
          value={searchParamsData.turma || ''}
          options={[
            { value: '', label: 'Todas' },
            ...turmas.map(t => ({ value: t, label: TURMA_LABELS[t] })),
          ]}
        />
        <FilterSelect
          label="Seguro"
          param="seguro"
          value={searchParamsData.seguro || ''}
          options={[
            { value: '', label: 'Todos' },
            { value: 'em_dia', label: 'Em dia' },
            { value: 'em_falta', label: 'Em falta' },
          ]}
        />
        <FilterSelect
          label="Inspeção"
          param="inspecao"
          value={searchParamsData.inspecao || ''}
          options={[
            { value: '', label: 'Todos' },
            { value: 'em_dia', label: 'Em dia' },
            { value: 'em_falta', label: 'Em falta' },
          ]}
        />
        {/* Persistência (localStorage) + botão Limpar — só renderiza
            quando há filtros activos */}
        <MembrosFiltersBar />
        <div className="ml-auto">
          <SortSelect value={sort} />
        </div>
      </div>

      {/* Erros */}
      {searchParamsData.error && (
        <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm">
          Ocorreu um erro. Tenta novamente.
        </div>
      )}

      {/* Tabela de membros — client component com seleção e ações em lote */}
      <MembrosTableClient
        ano={ano}
        membros={membrosFiltrados.map((m: any): MembroRow => ({
          id: m.id,
          nome: m.nome,
          email: m.email ?? null,
          telefone: m.telefone ?? null,
          turma: m.turma,
          data_nascimento: m.data_nascimento ?? null,
          is_competicao: m.is_competicao ?? false,
          is_isento: m.is_isento ?? false,
          observacoes: m.observacoes ?? null,
          seguro_ano_pago: m.seguro_ano_pago ?? null,
          cota: m.cota ?? null,
          status: m.status as StatusMembro,
          _inativo: m._inativo,
          _inspecaoOk: m._inspecaoOk,
          _seguroOk: seguroAtivo(m),
        }))}
      />
    </div>
  )
}
