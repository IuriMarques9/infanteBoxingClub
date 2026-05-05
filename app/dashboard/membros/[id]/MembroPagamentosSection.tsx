'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Shield } from 'lucide-react'
import MemberPaymentMatrix from '@/components/dashboard/MemberPaymentMatrix'
import PaymentRegisterModal from '@/components/dashboard/PaymentRegisterModal'
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

        {/* Card de seguro com botão para registar */}
        <div className="bg-[#121212] rounded-2xl border border-white/5 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Seguro Anual</p>
                {seguro ? (
                  <p className="text-sm text-white/90 mt-0.5">
                    {seguro.ano} · <span className="text-[#E8B55B] font-bold">{seguro.valor}€</span>
                    {seguro.descricao && <span className="text-white/40 ml-2">{seguro.descricao}</span>}
                  </p>
                ) : (
                  <p className="text-sm text-amber-300/80 mt-0.5">Sem seguro registado em {year}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E8B55B]/10 border border-[#E8B55B]/30 text-[#E8B55B] text-xs font-bold uppercase tracking-wider hover:bg-[#E8B55B]/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Registar Seguro
            </button>
          </div>
        </div>
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
