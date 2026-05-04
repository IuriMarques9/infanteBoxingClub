'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import PaymentRegisterModal from '@/components/dashboard/PaymentRegisterModal'

interface MembroOption {
  id: string
  nome: string
  turma: string
  is_isento: boolean
  is_competicao: boolean
}

interface Props {
  year: number
  membros: MembroOption[]
}

export default function PagamentosHeader({ year, membros }: Props) {
  const router = useRouter()
  const sp = useSearchParams()
  const [open, setOpen] = useState(false)
  const currentYear = new Date().getFullYear()

  function changeYear(y: number) {
    const params = new URLSearchParams(sp.toString())
    if (y === currentYear) params.delete('ano')
    else params.set('ano', String(y))
    router.push(`/dashboard/pagamentos${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-[#E8B55B] tracking-wider">Tesouraria</h1>
          <p className="text-white/50 text-sm mt-1">Gestão de cotas, seguros e outros pagamentos.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 bg-[#1A1A1A] border border-white/5 rounded-xl px-1 py-1">
            <button
              type="button"
              onClick={() => changeYear(year - 1)}
              className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center"
              aria-label="Ano anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-sm font-bold text-white/90 min-w-[3rem] text-center">{year}</span>
            <button
              type="button"
              onClick={() => changeYear(year + 1)}
              disabled={year >= currentYear}
              className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Ano seguinte"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8B55B] text-black text-xs font-bold uppercase tracking-widest hover:bg-[#C99C4A] shadow-[0_0_15px_rgba(232,181,91,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" /> Registar Pagamento
          </button>
        </div>
      </div>

      <PaymentRegisterModal
        open={open}
        onOpenChange={setOpen}
        membros={membros as any}
      />
    </>
  )
}
