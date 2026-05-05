'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Pencil, Trash2, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import Chip from '@/components/shared/Chip'
import ConfirmDeleteDialog from '@/components/dashboard/ConfirmDeleteDialog'
import PaymentEditModal from './PaymentEditModal'
import { eliminarPagamento } from './actions'
import type { PagamentoRow, PagamentoTipo } from '@/lib/payments'
import { PAGAMENTO_TIPOS, formatMesReferencia } from '@/lib/payments'
import { TURMA_LABELS, type Turma } from '@/app/dashboard/membros/constants'

interface Props {
  pagamentos: PagamentoRow[]
  total: number
  page: number
  pageSize: number
  /** Lista de membros para o combobox de filtro. */
  membrosFilter: { id: string; nome: string }[]
}

export default function PagamentosTable({ pagamentos, total, page, pageSize, membrosFilter }: Props) {
  const router = useRouter()
  const sp = useSearchParams()
  const [pending, start] = useTransition()
  const [filtering, startFilter] = useTransition()
  const [editTarget, setEditTarget] = useState<PagamentoRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PagamentoRow | null>(null)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  function setFilter(k: string, v: string) {
    const params = new URLSearchParams(sp.toString())
    if (v) params.set(k, v)
    else params.delete(k)
    params.delete('page')
    // `scroll: false` mantém a posição actual do scroll — sem isto a página
    // saltava para o topo cada vez que o admin mudava um filtro.
    startFilter(() => {
      router.replace(`/dashboard/pagamentos?${params.toString()}`, { scroll: false })
    })
  }

  function clearFilters() {
    startFilter(() => {
      router.replace('/dashboard/pagamentos', { scroll: false })
    })
  }

  function buildPageHref(p: number) {
    const params = new URLSearchParams(sp.toString())
    if (p > 1) params.set('page', String(p))
    else params.delete('page')
    const qs = params.toString()
    return qs ? `/dashboard/pagamentos?${qs}` : '/dashboard/pagamentos'
  }

  function handleDelete() {
    if (!deleteTarget) return
    start(async () => {
      const res = await eliminarPagamento(deleteTarget.id)
      if (res.error) toast.error(res.error)
      else {
        toast.success('Pagamento eliminado')
        setDeleteTarget(null)
        router.refresh()
      }
    })
  }

  const turmas: Turma[] = ['gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres']
  const tipos: PagamentoTipo[] = ['cota', 'seguro', 'loja', 'evento', 'outro']

  return (
    <>
      <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        {/* Filtros */}
        <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-white/30" />
          <select
            value={sp.get('tipo') ?? ''}
            onChange={e => setFilter('tipo', e.target.value)}
            className="px-3 py-1.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#E8B55B]"
          >
            <option value="">Todos os tipos</option>
            {tipos.map(t => <option key={t} value={t}>{PAGAMENTO_TIPOS[t].label}</option>)}
          </select>
          <select
            value={sp.get('turma') ?? ''}
            onChange={e => setFilter('turma', e.target.value)}
            className="px-3 py-1.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#E8B55B]"
          >
            <option value="">Todas as turmas</option>
            {turmas.map(t => <option key={t} value={t}>{TURMA_LABELS[t]}</option>)}
          </select>
          <select
            value={sp.get('membro') ?? ''}
            onChange={e => setFilter('membro', e.target.value)}
            className="px-3 py-1.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#E8B55B] max-w-[200px]"
          >
            <option value="">Todos os membros</option>
            {membrosFilter.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
          <input
            type="month"
            value={sp.get('from') ?? ''}
            onChange={e => setFilter('from', e.target.value)}
            placeholder="De"
            className="px-3 py-1.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-xs [color-scheme:dark] focus:outline-none focus:ring-1 focus:ring-[#E8B55B]"
          />
          <input
            type="month"
            value={sp.get('to') ?? ''}
            onChange={e => setFilter('to', e.target.value)}
            placeholder="Até"
            className="px-3 py-1.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-xs [color-scheme:dark] focus:outline-none focus:ring-1 focus:ring-[#E8B55B]"
          />
          {(sp.get('tipo') || sp.get('turma') || sp.get('membro') || sp.get('from') || sp.get('to')) && (
            <button
              onClick={clearFilters}
              disabled={filtering}
              className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/50 hover:text-[#E8B55B] transition-colors disabled:opacity-50"
            >
              Limpar
            </button>
          )}
          {filtering && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E8B55B]">
              <Loader2 className="w-3 h-3 animate-spin" /> A filtrar…
            </span>
          )}
          <span className="ml-auto text-[10px] text-white/40 uppercase tracking-widest">{total} entrada{total !== 1 ? 's' : ''}</span>
        </div>

        {/* Tabela — opacity reduzida durante filtragem para sinalizar loading */}
        <div className={`overflow-x-auto transition-opacity ${filtering ? 'opacity-50' : ''}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left px-3 sm:px-6 py-3 text-white/50 text-[10px] uppercase tracking-wider font-medium">Tipo</th>
                <th className="text-left px-3 sm:px-6 py-3 text-white/50 text-[10px] uppercase tracking-wider font-medium">Membro</th>
                <th className="text-left px-3 sm:px-6 py-3 text-white/50 text-[10px] uppercase tracking-wider font-medium hidden md:table-cell">Mês / Descrição</th>
                <th className="text-right px-3 sm:px-6 py-3 text-white/50 text-[10px] uppercase tracking-wider font-medium">Valor</th>
                <th className="text-left px-3 sm:px-6 py-3 text-white/50 text-[10px] uppercase tracking-wider font-medium hidden sm:table-cell">Data</th>
                <th className="text-right px-3 sm:px-6 py-3 text-white/50 text-[10px] uppercase tracking-wider font-medium w-20">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pagamentos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-white/20 italic">
                    Nenhum pagamento encontrado para os filtros aplicados.
                  </td>
                </tr>
              ) : (
                pagamentos.map(p => {
                  const cfg = PAGAMENTO_TIPOS[p.tipo]
                  const Icon = cfg.icon
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-3 sm:px-6 py-3">
                        <Chip tone={cfg.tone} size="sm">
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </Chip>
                      </td>
                      <td className="px-3 sm:px-6 py-3">
                        {p.membros?.nome ? (
                          <Link href={`/dashboard/membros/${p.membro_id}`} className="text-white/90 hover:text-[#E8B55B] transition-colors font-medium">
                            {p.membros.nome}
                          </Link>
                        ) : (
                          <span className="text-white/40 italic">Membro eliminado</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-white/60 text-xs hidden md:table-cell">
                        {p.tipo === 'cota'
                          ? formatMesReferencia(p.mes_referencia)
                          : (p.descricao || '—')}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-right text-[#E8B55B] font-bold">
                        {Number(p.valor).toFixed(0)}€
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-white/40 text-[11px] hidden sm:table-cell whitespace-nowrap">
                        {new Date(p.data_pagamento).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditTarget(p)}
                            disabled={pending}
                            title="Editar"
                            className="w-7 h-7 rounded-md text-white/40 hover:text-[#E8B55B] hover:bg-[#E8B55B]/10 flex items-center justify-center"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(p)}
                            disabled={pending}
                            title="Eliminar"
                            className="w-7 h-7 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center"
                          >
                            {pending && deleteTarget?.id === p.id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {total > pageSize && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.02]">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              Página {page} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link href={buildPageHref(page - 1)} className="inline-flex items-center gap-1 px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-lg text-xs font-bold text-white/70 hover:text-[#E8B55B] hover:border-[#E8B55B]/30 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-lg text-xs font-bold text-white/20">
                  <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                </span>
              )}
              {page < totalPages ? (
                <Link href={buildPageHref(page + 1)} className="inline-flex items-center gap-1 px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-lg text-xs font-bold text-white/70 hover:text-[#E8B55B] hover:border-[#E8B55B]/30 transition-colors">
                  Próxima <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-lg text-xs font-bold text-white/20">
                  Próxima <ChevronRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <PaymentEditModal
        open={!!editTarget}
        onOpenChange={o => { if (!o) setEditTarget(null) }}
        pagamento={editTarget}
      />

      {/* Delete confirm */}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={o => { if (!o && !pending) setDeleteTarget(null) }}
        title={`Eliminar pagamento?`}
        description={`Vais eliminar um pagamento de ${deleteTarget?.valor ?? '?'}€ ${deleteTarget?.tipo ? `(${PAGAMENTO_TIPOS[deleteTarget.tipo].label})` : ''}. Esta acção não pode ser revertida.`}
        confirmLabel={pending ? 'A eliminar…' : 'Eliminar'}
        onConfirm={handleDelete}
      />
    </>
  )
}
