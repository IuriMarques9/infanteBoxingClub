'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { X, Loader2 } from 'lucide-react'
import { editarPagamento } from './actions'
import type { PagamentoRow } from '@/lib/payments'
import { PAGAMENTO_TIPOS } from '@/lib/payments'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  pagamento: PagamentoRow | null
}

export default function PaymentEditModal({ open, onOpenChange, pagamento }: Props) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [valor, setValor] = useState('')
  const [mes, setMes] = useState('')
  const [data, setData] = useState('')
  const [descricao, setDescricao] = useState('')

  // Inicializar quando o pagamento muda
  if (pagamento && valor === '' && pagamento.valor !== undefined) {
    setValor(String(pagamento.valor))
    setMes(pagamento.mes_referencia || '')
    setData(pagamento.data_pagamento ? pagamento.data_pagamento.slice(0, 10) : '')
    setDescricao(pagamento.descricao || '')
  }

  if (!open || !pagamento) return null

  const isCota = pagamento.tipo === 'cota'
  const tipoCfg = PAGAMENTO_TIPOS[pagamento.tipo]

  function submit() {
    const v = parseFloat(valor)
    if (isNaN(v) || v <= 0) return toast.error('Valor inválido.')

    start(async () => {
      const res = await editarPagamento(pagamento!.id, {
        valor: v,
        mes_referencia: isCota ? mes : null,
        data_pagamento: data ? new Date(data).toISOString() : undefined,
        descricao: descricao || null,
      })
      if (res.error) toast.error(res.error)
      else {
        toast.success('Pagamento actualizado')
        // reset state for next open
        setValor('')
        onOpenChange(false)
        router.refresh()
      }
    })
  }

  function close() {
    setValor('') // reset state on close
    onOpenChange(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={() => !pending && close()}
    >
      <div
        className="bg-[#121212] border border-[#E8B55B]/20 rounded-2xl shadow-2xl p-6 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-headline font-bold text-[#E8B55B] tracking-wider">Editar Pagamento</h3>
            <p className="text-white/50 text-xs mt-1">{tipoCfg.label} · {pagamento.membros?.nome ?? '—'}</p>
          </div>
          <button
            type="button"
            onClick={close}
            disabled={pending}
            aria-label="Fechar"
            className="w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/5 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Valor (€)</label>
            <input
              type="number"
              step="0.01"
              value={valor}
              onChange={e => setValor(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B55B]"
            />
          </div>

          {isCota && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Mês de Referência</label>
              <input
                type="month"
                value={mes}
                onChange={e => setMes(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl text-sm [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-[#E8B55B]"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Data de Pagamento</label>
            <input
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl text-sm [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-[#E8B55B]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Descrição (opcional)</label>
            <input
              type="text"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B55B]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-white/5">
          <button type="button" onClick={close} disabled={pending} className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5">
            Cancelar
          </button>
          <button type="button" onClick={submit} disabled={pending} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#E8B55B] hover:bg-[#C99C4A] disabled:opacity-50">
            {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
