import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Trophy, FileText, Shield, Clock, UserCircle2, UserX } from 'lucide-react'
import { editarMembro, eliminarMembro, calcularEstado } from '../actions'
import { TURMA_LABELS, STATUS_CONFIG, COTAS_SUGERIDAS, SEGURO_LABELS, type Turma, type SeguroPago } from '../constants'
import { anoAtual, seguroAtivo, membroInativo } from '@/lib/membros-estado'
import DocumentUploader from './DocumentUploader'
import FichaClienteForm from './FichaClienteForm'
import AvatarUploader from './AvatarUploader'
import PaymentGrid from './PaymentGrid'
import DocumentCard from '@/components/dashboard/DocumentCard'
import EmptyState from '@/components/shared/EmptyState'
import { SubmitPrimary, SubmitDelete } from '@/components/dashboard/FormButtons'
import { BackLink } from '@/components/dashboard/PendingLink'

// ─── PÁGINA DE PERFIL INDIVIDUAL DO MEMBRO ─────────────────────
// Mostra todos os dados do sócio, estado calculado dinamicamente,
// historial de pagamentos com auditoria, e documentos enviados.
// Todas as alterações são registadas na tabela activity_log.
export const metadata = { title: 'Perfil do Membro | Dashboard' }

export default async function MembroProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; ano?: string }>
}) {
  const supabase = await createClient()
  const { id } = await params
  const searchParamsData = await searchParams

  const anoGrid = Number(searchParamsData.ano) || anoAtual()

  // Buscar membro com pagamentos
  const { data: membro, error } = await (supabase
    .from('membros')
    .select('*, pagamentos (*)')
    .eq('id', id)
    .single() as any)

  if (error || !membro) notFound()

  const pagamentos = (membro.pagamentos || []) as any[]
  const mesesPagos: string[] = pagamentos.map(p => p.mes_referencia)

  // Calcular estado com a nova lógica
  const status = await calcularEstado(membro)
  const statusCfg = STATUS_CONFIG[status]

  const seguroOk = seguroAtivo(membro)
  const inativo = membroInativo(membro, mesesPagos)
  const ano = anoAtual()

  // Buscar ficha de cliente (1:1 com o membro)
  const { data: ficha } = await (supabase
    .from('fichas_cliente')
    .select('*')
    .eq('membro_id', id)
    .maybeSingle() as any)

  // Buscar documentos via tabela de metadata
  const { data: documentos } = await (supabase
    .from('document_metadata')
    .select('*')
    .eq('membro_id', id)
    .order('uploaded_at', { ascending: false }) as any)

  const docsGrouped: Record<string, any[]> = {}
  ;(documentos || []).forEach((d: any) => {
    docsGrouped[d.categoria] = docsGrouped[d.categoria] || []
    docsGrouped[d.categoria].push(d)
  })

  const CATEGORIA_DISPLAY: Record<string, string> = {
    declaracao: 'Declaração dos Pais',
    seguro: 'Comprovativo de Seguro',
    inspecao_medica: 'Inspeção Médica',
    outro: 'Outro',
  }
  const CATEGORIA_ORDER = ['declaracao', 'seguro', 'inspecao_medica', 'outro']
  const docsCategoriasOrdenadas = CATEGORIA_ORDER.filter(k => docsGrouped[k]?.length)
  const inspecaoOk = (docsGrouped['inspecao_medica']?.length || 0) > 0

  // Avatar — pega o último upload com categoria 'avatar' e gera signed URL.
  let avatarUrl: string | null = null
  const avatarDoc = (docsGrouped['avatar'] || [])[0]
  if (avatarDoc?.storage_path) {
    const { data: signed } = await supabase.storage
      .from('documentos')
      .createSignedUrl(avatarDoc.storage_path, 60 * 60)  // 1h
    avatarUrl = signed?.signedUrl ?? null
  }

  // Buscar log de atividades deste membro (para a secção de auditoria)
  const { data: logs } = await (supabase
    .from('activity_log')
    .select('*')
    .eq('entity_id', id)
    .order('created_at', { ascending: false })
    .limit(10) as any)

  const turmas: Turma[] = ['gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres']

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Cabeçalho */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
          <BackLink href="/dashboard/membros" />
          <AvatarUploader membroId={id} nome={membro.nome} currentUrl={avatarUrl} />
          <div className="min-w-0">
            <h1 className="text-2xl font-headline font-bold text-[#E8B55B] tracking-wider flex items-center gap-3 flex-wrap">
              {membro.nome}
              {membro.is_competicao && <Trophy className="w-5 h-5 text-[#E8B55B]" />}
              {membro.is_isento && <Shield className="w-5 h-5 text-blue-400" />}
            </h1>
            <div className="flex gap-2 items-center mt-1 flex-wrap">
              <span className="text-white/40 text-sm">{TURMA_LABELS[membro.turma as Turma]}</span>
              {inativo ? (
                <span className="text-xs px-2 py-0.5 rounded font-bold border bg-red-500/10 text-red-400 border-red-500/30 inline-flex items-center gap-1">
                  <UserX className="w-3 h-3" /> Inativo
                </span>
              ) : (
                <span className={`text-xs px-2 py-0.5 rounded font-bold border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                  {statusCfg.label}
                </span>
              )}
              {seguroOk ? (
                <span className="text-xs px-2 py-0.5 rounded font-bold border bg-green-500/10 text-green-400 border-green-500/20">Seguro Pago {ano}</span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded font-bold border bg-amber-400/10 text-amber-300 border-amber-400/20">Seguro em falta</span>
              )}
              {inspecaoOk ? (
                <span className="text-xs px-2 py-0.5 rounded font-bold border bg-green-500/10 text-green-400 border-green-500/20">Inspeção Médica {ano}</span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded font-bold border bg-amber-400/10 text-amber-300 border-amber-400/20">Inspeção Médica em falta</span>
              )}
            </div>
          </div>
        </div>

        <form action={eliminarMembro}>
          <input type="hidden" name="id" value={membro.id} />
          <SubmitDelete>Eliminar</SubmitDelete>
        </form>
      </div>

      {/* Erros */}
      {searchParamsData?.error && (
        <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm">
          Ocorreu um erro. Tenta novamente.
        </div>
      )}

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Coluna Esquerda: Edição (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-white/90 font-medium mb-6 text-sm uppercase tracking-wider">Dados Pessoais</h2>
            <form action={editarMembro} className="space-y-5">
              <input type="hidden" name="id" value={membro.id} />

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Nome Completo</label>
                <input name="nome" defaultValue={membro.nome} required className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Cota (€)</label>
                <input
                  name="cota"
                  type="number"
                  step="0.01"
                  min="0"
                  list="cotas-sugeridas"
                  defaultValue={membro.cota ?? 30}
                  className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm"
                />
                <datalist id="cotas-sugeridas">
                  {COTAS_SUGERIDAS.map(v => <option key={v} value={v} />)}
                </datalist>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Turma</label>
                <select name="turma" defaultValue={membro.turma} className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm appearance-none">
                  {turmas.map(t => (<option key={t} value={t}>{TURMA_LABELS[t]}</option>))}
                </select>
              </div>

              {/* Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-[#E8B55B]/5 rounded-xl border border-[#E8B55B]/10">
                  <input name="is_competicao" type="checkbox" defaultChecked={membro.is_competicao} className="w-5 h-5 accent-[#E8B55B]" />
                  <span className="text-sm text-white/80">Competição 🏆</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-400/5 rounded-xl border border-blue-400/10">
                  <input name="is_isento" type="checkbox" defaultChecked={membro.is_isento} className="w-5 h-5 accent-blue-400" />
                  <span className="text-sm text-white/80">Isento 🛡️</span>
                </div>
              </div>

              {/* Seguro (anual) — Inspeção Médica é derivada do upload do ficheiro */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Seguro Pago ({ano})</label>
                <select
                  name="seguro_pago"
                  defaultValue={seguroOk ? (membro.seguro_pago || '') : ''}
                  className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm appearance-none"
                >
                  <option value="">🚫 Não Pago</option>
                  {(Object.keys(SEGURO_LABELS) as SeguroPago[]).map(s => (
                    <option key={s} value={s}>{SEGURO_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Observações</label>
                <textarea
                  name="observacoes"
                  defaultValue={membro.observacoes || ''}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm resize-none"
                />
              </div>

              <SubmitPrimary pendingLabel="A guardar…">Guardar Alterações</SubmitPrimary>
            </form>
          </div>

          {/* Ficha de Cliente */}
          <div className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-white/90 font-medium mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <UserCircle2 className="w-4 h-4 text-[#E8B55B]" /> Ficha de Cliente
            </h2>
            <FichaClienteForm membroId={membro.id} ficha={ficha} />
          </div>

          {/* Documentos */}
          <div className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-white/90 font-medium mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#E8B55B]" /> Documentos
            </h2>
            <p className="text-white/40 text-xs mb-4">CC, Ficha Médica, Termos de Responsabilidade, etc.</p>

            {docsCategoriasOrdenadas.length > 0 ? (
              <div className="space-y-2 mb-6">
                {docsCategoriasOrdenadas.map((cat) => {
                  const items = docsGrouped[cat]
                  return (
                    <details
                      key={cat}
                      open
                      className="group rounded-xl border border-white/5 bg-white/[0.02]"
                    >
                      <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 text-xs font-medium uppercase tracking-wider text-white/70 hover:text-[#E8B55B] transition-colors">
                        <span>{CATEGORIA_DISPLAY[cat] || cat}</span>
                        <span className="text-white/30 text-[11px]">
                          {items.length} {items.length === 1 ? 'documento' : 'documentos'}
                        </span>
                      </summary>
                      <div className="space-y-2 px-3 pb-3 pt-1">
                        {items.map((d: any) => (
                          <DocumentCard
                            key={d.id}
                            id={d.id}
                            fileName={d.file_name}
                            categoria={d.categoria}
                            uploadedAt={d.uploaded_at}
                            sizeBytes={d.size_bytes}
                            mimeType={d.mime_type}
                            storagePath={d.storage_path}
                          />
                        ))}
                      </div>
                    </details>
                  )
                })}
              </div>
            ) : (
              <div className="mb-6">
                <EmptyState
                  icon={FileText}
                  title="Sem documentos"
                  description="Envia o primeiro documento do membro."
                />
              </div>
            )}
            <DocumentUploader membroId={membro.id} />
          </div>

          {/* Log de Auditoria */}
          <div className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white/90 font-medium text-sm uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/50" /> Historial de Alterações
              </h2>
              {logs && logs.length > 0 && (
                <Link
                  href={`/dashboard/logs?entity=membro&q=${id}`}
                  className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-[#E8B55B] transition-colors"
                >
                  Ver todos
                </Link>
              )}
            </div>
            {logs && logs.length > 0 ? (
              <div className="space-y-2">
                {logs.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#E8B55B]/50 mt-1.5 shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-white/70">{log.description}</p>
                      <p className="text-white/30 mt-1">{new Date(log.created_at).toLocaleString('pt-PT')} · Admin: {log.admin_id?.slice(0, 8)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/30 text-sm">Sem registos de alterações.</p>
            )}
          </div>
        </div>

        {/* Coluna Direita: Pagamentos (2/5) */}
        <div className="lg:col-span-2 space-y-6">
          <PaymentGrid membro={membro} pagamentos={pagamentos} ano={anoGrid} />
        </div>
      </div>
    </div>
  )
}
