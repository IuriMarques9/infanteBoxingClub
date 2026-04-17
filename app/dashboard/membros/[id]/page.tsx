import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Trophy, FileText, Trash2, CreditCard, Shield, Clock } from 'lucide-react'
import { editarMembro, eliminarMembro, registarPagamento, eliminarPagamento, calcularEstado } from '../actions'
import { TURMA_LABELS, STATUS_CONFIG, type Turma } from '../constants'
import DocumentUploader from './DocumentUploader'

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
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { id } = await params
  const searchParamsData = await searchParams

  // Buscar membro com pagamentos
  const { data: membro, error } = await (supabase
    .from('membros')
    .select('*, pagamentos (*)')
    .eq('id', id)
    .single() as any)

  if (error || !membro) notFound()

  // Ordenar pagamentos (mais recente primeiro)
  const pagamentos = (membro.pagamentos || []).sort((a: any, b: any) =>
    b.mes_referencia.localeCompare(a.mes_referencia)
  )

  // Calcular estado com a nova lógica
  const status = await calcularEstado(membro)
  const statusCfg = STATUS_CONFIG[status]

  // Buscar documentos do Storage
  const { data: documentos } = await supabase.storage.from('documentos').list(`membros/${id}`)
  const ficheiros = (documentos || []).filter(f => !f.name.startsWith('.'))

  // Buscar log de atividades deste membro (para a secção de auditoria)
  const { data: logs } = await (supabase
    .from('activity_log')
    .select('*')
    .eq('entity_id', id)
    .order('created_at', { ascending: false })
    .limit(10) as any)

  const turmas: Turma[] = ['gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres']
  const mesAtualFormatado = new Date().toISOString().slice(0, 7)

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/membros" className="text-white/50 hover:text-[#E8B55B] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-headline font-bold text-[#E8B55B] tracking-wider flex items-center gap-3">
              {membro.nome}
              {membro.is_competicao && <Trophy className="w-5 h-5 text-[#E8B55B]" />}
              {membro.is_isento && <Shield className="w-5 h-5 text-blue-400" />}
            </h1>
            <div className="flex gap-3 items-center mt-1">
              <span className="text-white/40 text-sm">{TURMA_LABELS[membro.turma as Turma]}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-bold border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                {statusCfg.label}
              </span>
            </div>
          </div>
        </div>

        <form action={eliminarMembro}>
          <input type="hidden" name="id" value={membro.id} />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-all"
          >
            <Trash2 className="w-4 h-4" /> Eliminar
          </button>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Email</label>
                  <input name="email" type="email" defaultValue={membro.email || ''} className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Telefone</label>
                  <input name="telefone" type="tel" defaultValue={membro.telefone || ''} className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Data de Nascimento</label>
                <input name="data_nascimento" type="date" defaultValue={membro.data_nascimento || ''} className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm [color-scheme:dark]" />
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

              <button type="submit" className="w-full py-3 rounded-xl bg-[#E8B55B] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#C99C4A] shadow-[0_0_15px_rgba(232,181,91,0.3)] transition-all">
                Guardar Alterações
              </button>
            </form>
          </div>

          {/* Documentos */}
          <div className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-white/90 font-medium mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#E8B55B]" /> Documentos
            </h2>
            <p className="text-white/40 text-xs mb-4">CC, Ficha Médica, Termos de Responsabilidade, etc.</p>

            {ficheiros.length > 0 ? (
              <div className="space-y-2 mb-4">
                {ficheiros.map(f => (
                  <div key={f.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 text-sm">
                    <span className="text-white/70 truncate">{f.name}</span>
                    <span className="text-white/30 text-xs shrink-0 ml-2">
                      {f.metadata?.size ? `${(f.metadata.size / 1024).toFixed(0)} KB` : ''}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/30 text-sm mb-4">Nenhum documento enviado.</p>
            )}
            <DocumentUploader membroId={membro.id} />
          </div>

          {/* Log de Auditoria */}
          <div className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-white/90 font-medium mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/50" /> Historial de Alterações
            </h2>
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
          {/* Registar pagamento */}
          <div className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-white/90 font-medium mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#E8B55B]" /> Registar Pagamento
            </h2>
            <form action={registarPagamento} className="space-y-4">
              <input type="hidden" name="membro_id" value={membro.id} />
              <div className="space-y-2">
                <label className="text-xs text-white/50">Mês de Referência</label>
                <input name="mes_referencia" type="month" defaultValue={mesAtualFormatado} required className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:ring-2 focus:ring-[#E8B55B] text-sm [color-scheme:dark]" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-white/50">Valor (€)</label>
                <input name="valor" type="number" step="0.01" defaultValue="30" required className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:ring-2 focus:ring-[#E8B55B] text-sm" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 font-bold text-xs uppercase tracking-wider hover:bg-green-500/30 transition-all">
                Confirmar Pagamento
              </button>
            </form>
          </div>

          {/* Historial */}
          <div className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-white/90 font-medium mb-4 text-sm uppercase tracking-wider">
              Historial de Pagamentos ({pagamentos.length})
            </h2>
            {pagamentos.length === 0 ? (
              <p className="text-white/30 text-sm">Sem pagamentos registados.</p>
            ) : (
              <div className="space-y-3">
                {pagamentos.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 group">
                    <div>
                      <p className="text-sm text-white/80 font-medium">{p.mes_referencia}</p>
                      <p className="text-xs text-white/40">{new Date(p.data_pagamento).toLocaleDateString('pt-PT')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-green-400">{p.valor}€</span>
                      <form action={eliminarPagamento}>
                        <input type="hidden" name="pagamento_id" value={p.id} />
                        <input type="hidden" name="membro_id" value={membro.id} />
                        <button type="submit" className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
