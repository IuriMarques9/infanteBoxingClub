'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, X, Shield, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { marcarPagamentosCota } from '@/app/dashboard/membros/actions'

interface Props {
  membroId: string
  cotasPagas: string[]      // ["2026-01", "2026-02", ...]
  isIsento: boolean
  cota: number
  year: number
  /** Callback opcional para mudar de ano (URL searchparam). */
  onYearChange?: (newYear: number) => void
}

const MESES_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export default function MemberPaymentMatrix({
  membroId,
  cotasPagas,
  isIsento,
  cota,
  year,
  onYearChange,
}: Props) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [busyMes, setBusyMes] = useState<string | null>(null)

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1 // 1-12

  function marcar(mes: string) {
    setBusyMes(mes)
    start(async () => {
      const res = await marcarPagamentosCota([membroId], mes)
      if (res.error) toast.error(res.error)
      else if ((res.count ?? 0) === 0) toast.warning('Nenhum pagamento registado.')
      else toast.success(`Pagamento de ${cota}€ registado · ${MESES_LABELS[parseInt(mes.slice(5), 10) - 1]} ${year}`)
      setBusyMes(null)
      router.refresh()
    })
  }

  const totalPago = cotasPagas.length * cota

  return (
    <div className="bg-[#121212] rounded-2xl border border-white/5 p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#E8B55B]">Cotas {year}</h3>
          <p className="text-xs text-white/40 mt-0.5">
            {isIsento ? 'Isento de pagamento' : `${cotasPagas.length} pago(s) · ${totalPago}€`}
          </p>
        </div>
        {onYearChange && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onYearChange(year - 1)}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center"
              aria-label="Ano anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-white/70 font-bold w-12 text-center">{year}</span>
            <button
              type="button"
              onClick={() => onYearChange(year + 1)}
              disabled={year >= currentYear}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Ano seguinte"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
        {MESES_LABELS.map((label, i) => {
          const mes = `${year}-${String(i + 1).padStart(2, '0')}`
          const pago = cotasPagas.includes(mes)
          const futuro = year === currentYear && (i + 1) > currentMonth
          const futuroOuOutroAno = year > currentYear || futuro
          const busy = busyMes === mes

          let cls = ''
          let Icon = X
          let title = ''
          if (isIsento) {
            cls = 'bg-blue-500/10 border-blue-500/30 text-blue-400 cursor-default'
            Icon = Shield
            title = 'Isento'
          } else if (pago) {
            cls = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 cursor-default'
            Icon = Check
            title = `Pago · ${cota}€`
          } else if (futuroOuOutroAno) {
            cls = 'bg-white/[0.03] border-white/5 text-white/20 cursor-default'
            Icon = X
            title = 'Mês futuro'
          } else {
            cls = 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-500/50 cursor-pointer'
            Icon = X
            title = `Em atraso · clica para registar ${cota}€`
          }

          const clickable = !isIsento && !pago && !futuroOuOutroAno && !busy

          return (
            <button
              key={mes}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && marcar(mes)}
              title={title}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all ${cls}`}
            >
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">{label}</span>
              {busy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
