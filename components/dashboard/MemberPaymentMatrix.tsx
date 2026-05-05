'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, Shield, Loader2, ChevronLeft, ChevronRight, X, CreditCard } from 'lucide-react'
import { marcarPagamentosCota } from '@/app/dashboard/membros/actions'
import { eliminarPagamento } from '@/app/dashboard/pagamentos/actions'

interface CotaPaga {
  mes: string         // "YYYY-MM"
  id: string          // pagamento_id
  valor: number
}

interface Props {
  membroId: string
  cotasPagas: CotaPaga[]
  isIsento: boolean
  cota: number
  year: number
  /** Callback opcional para mudar de ano (URL searchparam). */
  onYearChange?: (newYear: number) => void
}

const MESES_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const MESES_FULL = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

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

  // Map mes → CotaPaga (acesso rápido)
  const porMes = new Map<string, CotaPaga>()
  cotasPagas.forEach(c => porMes.set(c.mes, c))

  const totalPago = cotasPagas.reduce((s, c) => s + c.valor, 0)

  function marcar(mes: string) {
    setBusyMes(mes)
    start(async () => {
      const res = await marcarPagamentosCota([membroId], mes)
      if (res.error) toast.error(res.error)
      else if ((res.count ?? 0) === 0) toast.warning('Nenhum pagamento registado.')
      else toast.success(`Pagamento de ${cota}€ registado · ${MESES_FULL[parseInt(mes.slice(5), 10) - 1]} ${year}`)
      setBusyMes(null)
      router.refresh()
    })
  }

  function eliminar(mes: string, id: string) {
    setBusyMes(mes)
    start(async () => {
      const res = await eliminarPagamento(id)
      if (res.error) toast.error(res.error)
      else toast.success(`Pagamento de ${MESES_FULL[parseInt(mes.slice(5), 10) - 1]} eliminado`)
      setBusyMes(null)
      router.refresh()
    })
  }

  return (
    <div className="bg-[#121212] rounded-2xl border border-white/5 p-5 sm:p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#E8B55B]" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#E8B55B]">Cotas {year}</h3>
          <span className="text-xs text-white/40 ml-2">
            {isIsento ? '· Isento' : `· ${cotasPagas.length} pago(s) · ${totalPago}€`}
          </span>
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

      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {MESES_LABELS.map((label, i) => {
          const mes = `${year}-${String(i + 1).padStart(2, '0')}`
          const pago = porMes.get(mes)
          const futuro = year === currentYear && (i + 1) > currentMonth
          const futuroOuOutroAno = year > currentYear || futuro
          const busy = busyMes === mes

          // ── ISENTO ─────────────────────────────────────────────
          if (isIsento) {
            return (
              <div
                key={mes}
                className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 flex flex-col items-center justify-center text-center min-h-[82px] cursor-default"
                title="Isento de cota"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300/80">
                  {label}
                </span>
                <Shield className="w-4 h-4 text-blue-400 mt-1.5" />
              </div>
            )
          }

          // ── PAGO ───────────────────────────────────────────────
          if (pago) {
            return (
              <div
                key={mes}
                className="group relative bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex flex-col items-center justify-center text-center min-h-[82px]"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/70">
                  {label}
                </span>
                <span className="text-sm font-bold text-emerald-300 mt-1">{pago.valor}€</span>
                <button
                  type="button"
                  onClick={() => eliminar(mes, pago.id)}
                  disabled={busy || pending}
                  aria-label={`Remover pagamento de ${MESES_FULL[i]}`}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-red-500/0 group-hover:bg-red-500/20 text-red-400/0 group-hover:text-red-300 flex items-center justify-center transition-all disabled:opacity-50"
                >
                  {busy
                    ? <Loader2 className="w-3 h-3 animate-spin text-emerald-300" />
                    : <X className="w-3 h-3" />}
                </button>
              </div>
            )
          }

          // ── MÊS FUTURO ─────────────────────────────────────────
          if (futuroOuOutroAno) {
            return (
              <div
                key={mes}
                className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center min-h-[82px] cursor-default opacity-50"
                title="Mês futuro"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                  {label}
                </span>
                <span className="text-sm font-bold text-white/30 mt-1">{cota}€</span>
              </div>
            )
          }

          // ── EM ATRASO ──────────────────────────────────────────
          return (
            <button
              key={mes}
              type="button"
              onClick={() => marcar(mes)}
              disabled={busy || pending}
              title={`Em atraso · clica para registar ${cota}€`}
              className="bg-white/[0.02] border border-white/5 hover:border-[#E8B55B]/40 hover:bg-[#E8B55B]/5 rounded-xl p-3 flex flex-col items-center justify-center text-center min-h-[82px] transition-all group disabled:opacity-50"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 group-hover:text-[#E8B55B]/80">
                {label}
              </span>
              <span className="text-sm font-bold text-white/50 group-hover:text-[#E8B55B] mt-1">{cota}€</span>
              {busy ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E8B55B] mt-1" />
              ) : (
                <Check className="w-3.5 h-3.5 text-white/20 group-hover:text-[#E8B55B] mt-1" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
