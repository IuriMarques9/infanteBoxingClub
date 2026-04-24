import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, UserCheck, UserX, Trophy, Shield } from 'lucide-react'
import { TURMA_LABELS, STATUS_CONFIG, type Turma, type StatusMembro } from './constants'
import { calcularEstado } from './actions'
import { anoAtual, seguroAtivo, membroInativo } from '@/lib/membros-estado'
import SortSelect from './SortSelect'
import FilterSelect from './FilterSelect'
import SearchInput from './SearchInput'
import { LinkSpinner } from '@/components/dashboard/PendingLink'

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

  // Calcular o estado de cada membro segundo a nova lógica
  const membrosComStatus = await Promise.all((membros || []).map(async (m: any) => {
    const mesesPagos = (m.pagamentos || []).map((p: any) => p.mes_referencia)
    return {
      ...m,
      status: await calcularEstado(m) as StatusMembro,
      _inativo: membroInativo(m, mesesPagos),
      _inspecaoOk: comInspecao.has(m.id),
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
          <h1 className="text-3xl font-headline font-bold text-[#E8B55B] tracking-wider">
            Gestão de Membros
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {membrosComStatus.length} membro{membrosComStatus.length !== 1 ? 's' : ''} registado{membrosComStatus.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/membros/novo"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E8B55B] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#C99C4A] shadow-[0_0_15px_rgba(232,181,91,0.3)] hover:shadow-[0_0_25px_rgba(232,181,91,0.6)] transition-all"
        >
          <Plus className="w-4 h-4" /> Novo Membro
          <LinkSpinner className="text-black" />
        </Link>
      </div>

      {/* Cartões de estado */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Link href="/dashboard/membros" className={`bg-[#121212] p-4 rounded-2xl border transition-all ${!searchParamsData.status ? 'border-[#E8B55B]/30' : 'border-white/5 hover:border-white/10'}`}>
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-bold text-[#E8B55B]">{membrosComStatus.length}</p>
        </Link>
        <Link href="/dashboard/membros?status=pago" className={`bg-[#121212] p-4 rounded-2xl border transition-all ${searchParamsData.status === 'pago' ? 'border-green-400/30' : 'border-white/5 hover:border-white/10'}`}>
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><UserCheck className="w-3 h-3 text-green-400" /> Pagos</p>
          <p className="text-2xl font-bold text-green-400">{totalPago}</p>
        </Link>
        <Link href="/dashboard/membros?status=nao_pago" className={`bg-[#121212] p-4 rounded-2xl border transition-all ${searchParamsData.status === 'nao_pago' ? 'border-yellow-400/30' : 'border-white/5 hover:border-white/10'}`}>
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><UserX className="w-3 h-3 text-yellow-400" /> Não Pagos</p>
          <p className="text-2xl font-bold text-yellow-400">{totalNaoPago}</p>
        </Link>
        <Link href="/dashboard/membros?estado=inativo" className={`bg-[#121212] p-4 rounded-2xl border transition-all ${searchParamsData.estado === 'inativo' ? 'border-red-400/30' : 'border-white/5 hover:border-white/10'}`}>
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><UserX className="w-3 h-3 text-red-400" /> Inativos</p>
          <p className="text-2xl font-bold text-red-400">{totalInativo}</p>
        </Link>
        <Link href="/dashboard/membros?status=isento" className={`bg-[#121212] p-4 rounded-2xl border transition-all ${searchParamsData.status === 'isento' ? 'border-blue-400/30' : 'border-white/5 hover:border-white/10'}`}>
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><Shield className="w-3 h-3 text-blue-400" /> Isentos</p>
          <p className="text-2xl font-bold text-blue-400">{totalIsento}</p>
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

      {/* Tabela de membros */}
      <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Nome</th>
                <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Turma</th>
                <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Tags</th>
                <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Seguro</th>
                <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Inspeção</th>
                <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Estado</th>
                <th className="text-right px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {membrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center px-6 py-12 text-white/30">
                    Nenhum membro encontrado.
                  </td>
                </tr>
              ) : (
                membrosFiltrados.map((membro: any) => {
                  const statusCfg = STATUS_CONFIG[membro.status as StatusMembro]
                  return (
                    <tr key={membro.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#E8B55B]/10 border border-[#E8B55B]/30 flex items-center justify-center text-xs font-bold text-[#E8B55B] shrink-0">
                            {membro.nome.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              {membro._inativo && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30">
                                  Inativo
                                </span>
                              )}
                              <p className="text-white/90 font-medium">{membro.nome}</p>
                            </div>
                            {membro.telefone && <p className="text-white/40 text-xs">{membro.telefone}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/70">{TURMA_LABELS[membro.turma as Turma]}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {membro.is_competicao && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E8B55B]/10 text-[#E8B55B] border border-[#E8B55B]/20">
                              <Trophy className="w-3 h-3" /> Comp.
                            </span>
                          )}
                          {membro.is_isento && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-400/10 text-blue-400 border border-blue-400/20">
                              <Shield className="w-3 h-3" /> Isento
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/60 text-xs whitespace-nowrap">
                        {seguroAtivo(membro) ? (
                          <span className="inline-flex items-center gap-2 text-green-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            Pago {ano}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
                            Em falta
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white/60 text-xs whitespace-nowrap">
                        {membro._inspecaoOk ? (
                          <span className="inline-flex items-center gap-2 text-green-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            Entregue
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
                            Em falta
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border} border`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/membros/${membro.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#E8B55B] bg-[#E8B55B]/10 border border-[#E8B55B]/20 hover:bg-[#E8B55B]/20 transition-all opacity-0 group-hover:opacity-100 group-has-[a:focus]:opacity-100"
                        >
                          Ver Perfil
                          <LinkSpinner className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
