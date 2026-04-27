'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Trophy, Shield, StickyNote, Mail, Download,
  CreditCard, X, Loader2, Copy, Check, MoreVertical, Eye, Trash2,
} from 'lucide-react'
import { TURMA_LABELS, STATUS_CONFIG, type Turma, type StatusMembro } from './constants'
import { calcularIdade } from '@/lib/membros-estado'
import { exportMembrosCSV, eliminarMembro, marcarPagamentosCota, eliminarMembrosLote } from './actions'
import { toast } from 'sonner'

// ─── TABELA DE MEMBROS COM AÇÕES EM LOTE ───────────────────────
// Wrapper client-side da tabela que estava em page.tsx. Adiciona:
//   • checkbox por linha + checkbox "selecionar todos"
//   • barra fixa no fundo quando há ≥1 selecionado, com:
//       - Marcar pagamento (abre dialog inline com mês/valor)
//       - Copiar emails para o clipboard
//       - Exportar selecionados em CSV
//   • ano corrente, seguroAtivo, etc passados pelo server (sem drift de tempo).

export interface MembroRow {
  id: string
  nome: string
  email: string | null
  telefone: string | null
  turma: string
  data_nascimento: string | null
  is_competicao: boolean | null
  is_isento: boolean | null
  observacoes: string | null
  seguro_ano_pago: number | null
  cota: number | null
  status: StatusMembro
  _inativo: boolean
  _inspecaoOk: boolean
  _seguroOk: boolean
}

interface Props {
  membros: MembroRow[]
  ano: number
}

export default function MembrosTableClient({ membros, ano }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showPayDialog, setShowPayDialog] = useState(false)
  const [busy, setBusy] = useState<null | 'pay' | 'csv' | 'del' | 'copy'>(null)
  const [copyOk, setCopyOk] = useState(false)

  const allSelected = membros.length > 0 && selected.size === membros.length
  const someSelected = selected.size > 0 && selected.size < membros.length

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(membros.map(m => m.id)))
  }
  function clear() { setSelected(new Set()) }

  const selectedMembros = useMemo(
    () => membros.filter(m => selected.has(m.id)),
    [membros, selected],
  )
  const elegiveisPagamento = useMemo(
    () => selectedMembros.filter(m => !m.is_isento),
    [selectedMembros],
  )
  const selectedEmails = useMemo(
    () => selectedMembros.map(m => m.email).filter((e): e is string => !!e),
    [selectedMembros],
  )
  // Soma das cotas dos elegíveis — mostrado no dialog de pagamento.
  const totalCotas = useMemo(
    () => elegiveisPagamento.reduce((s, m) => s + Number(m.cota ?? 30), 0),
    [elegiveisPagamento],
  )

  async function handleCopyEmails() {
    if (selectedEmails.length === 0) {
      toast.warning('Nenhum dos selecionados tem email.')
      return
    }
    setBusy('copy')
    try {
      await navigator.clipboard.writeText(selectedEmails.join(', '))
      setCopyOk(true)
      toast.success(`${selectedEmails.length} email(s) copiado(s)`)
      setTimeout(() => setCopyOk(false), 2000)
    } catch {
      toast.error('Não foi possível copiar.')
    } finally {
      setBusy(null)
    }
  }

  async function handleExportCSV() {
    setBusy('csv')
    try {
      const csv = await exportMembrosCSV(Array.from(selected))
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `membros_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`CSV exportado (${selected.size} membro${selected.size !== 1 ? 's' : ''})`)
    } catch (e: any) {
      toast.error(e?.message || 'Falha ao exportar CSV.')
    } finally {
      setBusy(null)
    }
  }

  async function handleBulkPay(formData: FormData) {
    setBusy('pay')
    const mes = formData.get('mes_referencia') as string
    if (!mes) {
      toast.error('Mês obrigatório')
      setBusy(null)
      return
    }
    try {
      const ids = elegiveisPagamento.map(m => m.id)
      const res = await marcarPagamentosCota(ids, mes)
      if (res.error) {
        toast.error(res.error)
        return
      }
      setShowPayDialog(false)
      clear()
      router.refresh()
      const ignoradosTxt = res.ignorados ? ` · ${res.ignorados} isento(s) ignorado(s)` : ''
      toast.success(`${res.count} pagamento(s) registado(s)${ignoradosTxt}`)
    } finally {
      setBusy(null)
    }
  }

  async function handleBulkDelete() {
    const n = selected.size
    if (!window.confirm(`Eliminar ${n} membro(s) selecionado(s)?\nEsta ação não pode ser revertida.`)) return
    setBusy('del')
    try {
      const res = await eliminarMembrosLote(Array.from(selected))
      if (res.error) {
        toast.error(res.error)
        return
      }
      clear()
      router.refresh()
      toast.success(`${res.count} membro(s) eliminado(s)`)
    } catch (e: any) {
      toast.error(e?.message || 'Falha ao eliminar.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <>
      <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-2 sm:px-4 py-4 w-10">
                  <input
                    type="checkbox"
                    aria-label="Selecionar todos os membros"
                    checked={allSelected}
                    ref={el => { if (el) el.indeterminate = someSelected }}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-[#E8B55B] cursor-pointer"
                  />
                </th>
                <th className="text-left px-2 sm:px-6 py-4 text-white/50 text-[10px] sm:text-xs uppercase tracking-wider font-medium">Nome</th>
                <th className="text-left px-2 sm:px-6 py-4 text-white/50 text-[10px] sm:text-xs uppercase tracking-wider font-medium hidden sm:table-cell">Turma</th>
                <th className="text-left px-2 sm:px-6 py-4 text-white/50 text-[10px] sm:text-xs uppercase tracking-wider font-medium hidden lg:table-cell">Tags</th>
                <th className="text-left px-2 sm:px-6 py-4 text-white/50 text-[10px] sm:text-xs uppercase tracking-wider font-medium hidden md:table-cell">Seguro</th>
                <th className="text-left px-2 sm:px-6 py-4 text-white/50 text-[10px] sm:text-xs uppercase tracking-wider font-medium hidden lg:table-cell">Inspeção</th>
                <th className="text-left px-2 sm:px-6 py-4 text-white/50 text-[10px] sm:text-xs uppercase tracking-wider font-medium">Estado</th>
                <th className="text-right px-2 sm:px-6 py-4 text-white/50 text-[10px] sm:text-xs uppercase tracking-wider font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {membros.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center px-6 py-12 text-white/30">
                    Nenhum membro encontrado.
                  </td>
                </tr>
              ) : (
                membros.map(membro => {
                  const statusCfg = STATUS_CONFIG[membro.status]
                  const isSelected = selected.has(membro.id)
                  const idade = calcularIdade(membro.data_nascimento)
                  return (
                    <tr
                      key={membro.id}
                      className={`border-b border-white/5 transition-colors group ${isSelected ? 'bg-[#E8B55B]/[0.04]' : 'hover:bg-white/[0.02]'}`}
                    >
                      <td className="px-2 sm:px-4 py-4">
                        <input
                          type="checkbox"
                          aria-label={`Selecionar ${membro.nome}`}
                          checked={isSelected}
                          onChange={() => toggle(membro.id)}
                          className="w-4 h-4 accent-[#E8B55B] cursor-pointer"
                        />
                      </td>
                      <td className="px-2 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#E8B55B]/10 border border-[#E8B55B]/30 flex items-center justify-center text-xs font-bold text-[#E8B55B] shrink-0">
                            {membro.nome.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {membro._inativo && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30">
                                  Inativo
                                </span>
                              )}
                              <p className="text-white/90 font-medium truncate">{membro.nome}</p>
                              {idade !== null && (
                                <span className="text-white/40 text-[11px] font-medium" title={`Nascimento: ${membro.data_nascimento}`}>
                                  · {idade} anos
                                </span>
                              )}
                              {membro.observacoes && (
                                <span title={membro.observacoes} className="text-white/40 hover:text-[#E8B55B] cursor-help">
                                  <StickyNote className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </div>
                            <p className="text-white/40 text-[11px] sm:hidden">{TURMA_LABELS[membro.turma as Turma] ?? membro.turma}</p>
                            <div className="hidden sm:flex items-center gap-3 text-[11px] text-white/40 mt-0.5">
                              {membro.email && (
                                <a
                                  href={`mailto:${membro.email}`}
                                  className="inline-flex items-center gap-1 hover:text-[#E8B55B] transition-colors"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <Mail className="w-3 h-3" /> {membro.email}
                                </a>
                              )}
                              {membro.telefone && (
                                <span>{membro.telefone}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-4 text-white/70 hidden sm:table-cell">{TURMA_LABELS[membro.turma as Turma] ?? membro.turma}</td>
                      <td className="px-2 sm:px-6 py-4 hidden lg:table-cell">
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
                      <td className="px-2 sm:px-6 py-4 text-white/60 text-xs whitespace-nowrap hidden md:table-cell">
                        {membro._seguroOk ? (
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
                      <td className="px-2 sm:px-6 py-4 text-white/60 text-xs whitespace-nowrap hidden lg:table-cell">
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
                      <td className="px-2 sm:px-6 py-4">
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold whitespace-nowrap ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border} border`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-2 sm:px-6 py-4 text-right">
                        <MembroKebabMenu membro={membro} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:max-w-2xl md:w-[calc(100%-2rem)] z-30">
          <div className="bg-[#1A1A1A] border border-[#E8B55B]/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] p-3 sm:p-4 backdrop-blur">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 mr-auto">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#E8B55B]/15 text-[#E8B55B] text-xs font-bold">{selected.size}</span>
                <span className="text-white/70 text-xs sm:text-sm hidden sm:inline">selecionados</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPayDialog(true)}
                disabled={elegiveisPagamento.length === 0 || busy !== null}
                title={elegiveisPagamento.length === 0 ? 'Todos os selecionados são isentos' : `Marcar pagamento (cada um paga a sua cota — total ${totalCotas}€)`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pago</span>
                <span className="text-[10px] opacity-70">({elegiveisPagamento.length})</span>
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={busy !== null}
                title={`Eliminar ${selected.size} membro(s)`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider text-red-300 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {busy === 'del' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Remover</span>
              </button>
              <button
                type="button"
                onClick={handleCopyEmails}
                disabled={busy !== null}
                title={`Copiar ${selectedEmails.length} email(s)`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-300 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-all disabled:opacity-50"
              >
                {copyOk ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copyOk ? 'Copiado' : 'Emails'}</span>
                <span className="text-[10px] opacity-70">({selectedEmails.length})</span>
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={busy !== null}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#E8B55B] bg-[#E8B55B]/10 border border-[#E8B55B]/20 hover:bg-[#E8B55B]/20 transition-all disabled:opacity-50"
              >
                {busy === 'csv' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={clear}
                aria-label="Limpar seleção"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk payment dialog */}
      {showPayDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => !busy && setShowPayDialog(false)}>
          <div
            className="bg-[#121212] border border-[#E8B55B]/20 rounded-2xl shadow-2xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-headline font-bold text-[#E8B55B] tracking-wider">Marcar Pagamento</h3>
                <p className="text-white/50 text-xs mt-1">
                  Cada membro paga a sua própria cota.
                  {selected.size !== elegiveisPagamento.length && ` · ${selected.size - elegiveisPagamento.length} isento(s) ignorado(s)`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !busy && setShowPayDialog(false)}
                aria-label="Fechar"
                className="w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/5 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form action={handleBulkPay} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Mês de referência</label>
                <input
                  type="month"
                  name="mes_referencia"
                  defaultValue={new Date().toISOString().slice(0, 7)}
                  required
                  className="w-full px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-base sm:text-sm [color-scheme:dark]"
                />
              </div>
              <div className="max-h-44 overflow-y-auto custom-scrollbar bg-black/20 rounded-lg border border-white/5 p-3 space-y-1 text-xs text-white/70">
                {elegiveisPagamento.length === 0 ? (
                  <p className="italic text-white/30">Nenhum membro elegível (todos isentos).</p>
                ) : (
                  elegiveisPagamento.map(m => (
                    <p key={m.id} className="flex items-center justify-between gap-2 py-0.5">
                      <span className="truncate">{m.nome}</span>
                      <span className="text-[#E8B55B] font-mono shrink-0">{Number(m.cota ?? 30)}€</span>
                    </p>
                  ))
                )}
              </div>
              {elegiveisPagamento.length > 0 && (
                <div className="flex items-center justify-between text-sm border-t border-white/10 pt-3">
                  <span className="text-white/50 text-xs uppercase tracking-wider font-bold">Total a registar</span>
                  <span className="text-[#E8B55B] font-bold text-base">{totalCotas}€</span>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayDialog(false)}
                  disabled={busy === 'pay'}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={busy === 'pay' || elegiveisPagamento.length === 0}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#E8B55B] hover:bg-[#C99C4A] shadow-[0_0_15px_rgba(232,181,91,0.3)] transition-all disabled:opacity-50"
                >
                  {busy === 'pay' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Registar {totalCotas}€
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

// ─── KEBAB MENU POR LINHA (B4) ─────────────────────────────────
// Quick actions: ver perfil, marcar pagamento (mês atual, valor da
// cota), copiar email, eliminar (com confirm).
function MembroKebabMenu({ membro }: { membro: MembroRow }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState<null | 'pay' | 'copy' | 'del'>(null)

  async function quickPay() {
    if (membro.is_isento) return
    const cota = Number(membro.cota ?? 30)
    if (!window.confirm(`Marcar pagamento para ${membro.nome} de ${cota}€ (cota) referente a este mês?`)) return
    setBusy('pay')
    try {
      const res = await marcarPagamentosCota([membro.id], new Date().toISOString().slice(0, 7))
      if (res.error) {
        toast.error(res.error)
      } else {
        router.refresh()
        toast.success(`Pagamento de ${cota}€ registado para ${membro.nome}`)
      }
    } catch (e: any) {
      toast.error(e?.message || 'Falha ao registar pagamento')
    } finally {
      setBusy(null)
      setOpen(false)
    }
  }

  async function copyEmail() {
    if (!membro.email) return
    setBusy('copy')
    try {
      await navigator.clipboard.writeText(membro.email)
      toast.success('Email copiado')
    } catch {
      toast.error('Não foi possível copiar')
    } finally {
      setBusy(null)
      setOpen(false)
    }
  }

  async function remove() {
    if (!window.confirm(`Tens a certeza que queres eliminar "${membro.nome}"?\nEsta ação não pode ser revertida.`)) return
    setBusy('del')
    try {
      const fd = new FormData()
      fd.append('id', membro.id)
      await eliminarMembro(fd)
      toast.success(`${membro.nome} eliminado`)
      router.refresh()
    } catch (e: any) {
      toast.error(e?.message || 'Falha ao eliminar')
    } finally {
      setBusy(null)
      setOpen(false)
    }
  }

  return (
    <div className="relative inline-flex justify-end">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label={`Ações para ${membro.nome}`}
        aria-expanded={open}
        disabled={busy !== null}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/40 hover:text-[#E8B55B] hover:bg-[#E8B55B]/10 border border-transparent hover:border-[#E8B55B]/20 transition-all disabled:opacity-50"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 bg-[#1A1A1A] border border-[#E8B55B]/20 rounded-xl shadow-2xl py-1 min-w-[180px]">
            <Link
              href={`/dashboard/membros/${membro.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-white/70 hover:bg-[#E8B55B]/10 hover:text-[#E8B55B] transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> Ver perfil
            </Link>
            <button
              type="button"
              onClick={quickPay}
              disabled={!!membro.is_isento}
              title={membro.is_isento ? 'Membro isento' : 'Marcar pagamento do mês atual'}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/70 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-3.5 h-3.5" /> Marcar pagamento
            </button>
            <button
              type="button"
              onClick={copyEmail}
              disabled={!membro.email}
              title={membro.email || 'Sem email registado'}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/70 hover:bg-sky-500/10 hover:text-sky-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Mail className="w-3.5 h-3.5" /> Copiar email
            </button>
            <div className="my-1 border-t border-white/5" />
            <button
              type="button"
              onClick={remove}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-300/80 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  )
}
