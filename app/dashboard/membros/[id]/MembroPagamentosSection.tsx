'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Shield, CheckCircle2 } from 'lucide-react'
import MemberPaymentMatrix from '@/components/dashboard/MemberPaymentMatrix'
import PaymentRegisterModal from '@/components/dashboard/PaymentRegisterModal'
import { SEGURO_VALORES } from '@/lib/payments'
import type { Turma } from '@/app/dashboard/membros/constants'

interface CotaPaga {
  mes: string
  id: string
  valor: number
}

interface Props {
  membroId: string
  cotasPagas: CotaPaga[]
  isIsento: boolean
  cota: number
  year: number
  membro: {
    id: string
    nome: string
    turma: Turma
    is_isento: boolean
    is_competicao: boolean
  }
  seguro: { ano: number; valor: number; descricao: string | null } | null
}

export default function MembroPagamentosSection({
  membroId,
  cotasPagas,
  isIsento,
  cota,
  year,
  membro,
  seguro,
}: Props) {
  const router = useRouter()
  const sp = useSearchParams()
  const [open, setOpen] = useState(false)

  function changeYear(y: number) {
    const params = new URLSearchParams(sp.toString())
    params.set('ano', String(y))
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <>
      <div className="space-y-4">
        {/* Matriz de cotas 12 meses */}
        <MemberPaymentMatrix
          membroId={membroId}
          cotasPagas={cotasPagas}
          isIsento={isIsento}
          cota={cota}
          year={year}
          onYearChange={changeYear}
        />

        {/* Card de seguro — quando o seguro já cobre o ano (≥ 32€ recreativo
            ou ≥ 45€ competidor) mostramos badge "Pago" e escondemos botão.
            Caso contrário, mostra botão para registar (ou parcial). */}
        {(() => {
          const seguroCompleto = seguro && seguro.valor >= SEGURO_VALORES.recreativo
          const cardCls = seguroCompleto
            ? 'bg-emerald-500/[0.06] border-emerald-500/20'
            : 'bg-[#121212] border-white/5'
          const iconWrap = seguroCompleto
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
          return (
            <div className={`rounded-2xl border p-5 sm:p-6 shadow-xl ${cardCls}`}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconWrap}`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Seguro Anual</p>
                    {seguro ? (
                      <p className="text-sm text-white/90 mt-0.5 flex items-center gap-2 flex-wrap">
                        {seguro.ano} · <span className="text-[#E8B55B] font-bold">{seguro.valor}€</span>
                        {seguroCompleto && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" /> Pago
                          </span>
                        )}
                        {seguro.descricao && <span className="text-white/40 text-xs">{seguro.descricao}</span>}
                      </p>
                    ) : (
                      <p className="text-sm text-amber-300/80 mt-0.5">Sem seguro registado em {year}</p>
                    )}
                  </div>
                </div>
                {/* Só mostra o botão se ainda não há seguro completo */}
                {!seguroCompleto && (
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E8B55B]/10 border border-[#E8B55B]/30 text-[#E8B55B] text-xs font-bold uppercase tracking-wider hover:bg-[#E8B55B]/20 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> {seguro ? 'Adicionar parcial' : 'Registar Seguro'}
                  </button>
                )}
              </div>
            </div>
          )
        })()}
      </div>

      <PaymentRegisterModal
        open={open}
        onOpenChange={setOpen}
        membros={[membro]}
        defaultTipo="seguro"
        defaultMembroId={membroId}
      />
    </>
  )
}
