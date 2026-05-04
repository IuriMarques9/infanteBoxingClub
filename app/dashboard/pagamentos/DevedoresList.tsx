'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Check, MessageCircle, Mail, Users, AlertCircle } from 'lucide-react'
import { marcarPagamentosCota } from '@/app/dashboard/membros/actions'
import { TURMA_LABELS, type Turma } from '@/app/dashboard/membros/constants'
import { formatMesReferencia } from '@/lib/payments'

interface Devedor {
  membro_id: string
  nome: string
  email: string | null
  telefone: string | null
  turma: string
  cota: number
}

interface Props {
  devedores: Devedor[]
  mes: string
  /** Quando há mais que `devedores.length` em atraso, mostra link "Ver todos". */
  total: number
}

export default function DevedoresList({ devedores, mes, total }: Props) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

  function marcarPago(d: Devedor) {
    setBusyId(d.membro_id)
    start(async () => {
      const res = await marcarPagamentosCota([d.membro_id], mes)
      if (res.error) toast.error(res.error)
      else if ((res.count ?? 0) === 0) toast.warning('Nenhum pagamento registado.')
      else toast.success(`${d.nome} · pago ${d.cota}€ (${formatMesReferencia(mes)})`)
      setBusyId(null)
      router.refresh()
    })
  }

  function whatsappUrl(d: Devedor) {
    if (!d.telefone) return null
    const tel = d.telefone.replace(/\D/g, '')
    const txt = encodeURIComponent(
      `Olá ${d.nome}, lembramos que ainda falta o pagamento da cota de ${formatMesReferencia(mes)} (${d.cota}€). Cumprimentos, Infante Boxing Club.`
    )
    return `https://wa.me/${tel}?text=${txt}`
  }

  function mailtoUrl(d: Devedor) {
    if (!d.email) return null
    const subject = encodeURIComponent(`Pagamento em falta · ${formatMesReferencia(mes)}`)
    const body = encodeURIComponent(
      `Olá ${d.nome},\n\nLembramos que ainda falta o pagamento da cota de ${formatMesReferencia(mes)} no valor de ${d.cota}€.\n\nObrigado,\nInfante Boxing Club`
    )
    return `mailto:${d.email}?subject=${subject}&body=${body}`
  }

  if (devedores.length === 0) {
    return (
      <div className="bg-[#121212] rounded-2xl border border-white/5 p-8 shadow-xl text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-300">
          <Check className="w-5 h-5" />
        </div>
        <p className="text-emerald-200/90 font-medium">Sem devedores este mês.</p>
        <p className="text-white/40 text-xs mt-1">Todos os atletas não-isentos pagaram a cota de {formatMesReferencia(mes)}.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      <div className="px-5 py-4 border-b border-white/5 bg-amber-500/5 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-300" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-amber-300">
          Devedores · {formatMesReferencia(mes)}
        </h3>
        <span className="ml-auto text-[10px] text-white/40 uppercase tracking-widest">
          {devedores.length}{total > devedores.length ? ` de ${total}` : ''}
        </span>
      </div>

      <div className="divide-y divide-white/5 max-h-[480px] overflow-y-auto">
        {devedores.map(d => {
          const wa = whatsappUrl(d)
          const ml = mailtoUrl(d)
          const busy = busyId === d.membro_id
          return (
            <div key={d.membro_id} className="p-3 sm:p-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#E8B55B]/10 border border-[#E8B55B]/30 flex items-center justify-center text-[#E8B55B] font-bold text-xs shrink-0">
                {d.nome.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/dashboard/membros/${d.membro_id}`} className="text-white/90 hover:text-[#E8B55B] font-medium text-sm transition-colors block truncate">
                  {d.nome}
                </Link>
                <p className="text-[11px] text-white/40 truncate">
                  {TURMA_LABELS[d.turma as Turma] ?? d.turma} · cota {d.cota}€
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => marcarPago(d)}
                  disabled={busy || pending}
                  title="Marcar pago"
                  className="inline-flex items-center justify-center gap-1 w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                >
                  {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                </button>
                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="WhatsApp"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span title="Sem telefone" className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/20">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </span>
                )}
                {ml ? (
                  <a
                    href={ml}
                    title="Email"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span title="Sem email" className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/20">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {total > devedores.length && (
        <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] text-center">
          <Link
            href={`/dashboard/pagamentos?from=${mes}&to=${mes}&tipo=cota`}
            className="text-[11px] font-bold uppercase tracking-wider text-[#E8B55B] hover:text-[#C99C4A] transition-colors inline-flex items-center gap-1"
          >
            <Users className="w-3 h-3" /> Ver todos os {total} pagamentos
          </Link>
        </div>
      )}
    </div>
  )
}
