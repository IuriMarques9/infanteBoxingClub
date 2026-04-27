'use client'

import { useState, useTransition } from 'react'
import { Copy, Loader2 } from 'lucide-react'
import { duplicarDiaHorario } from './actions'
import { WEEKDAY_LABELS_LONG, type WeekDay } from '@/lib/horarios'

const DIAS: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

// ─── BOTÃO DE DUPLICAR PARA OUTRO DIA (C2) ─────────────────────
// Aparece em cada slot da matriz (no hover). Mostra um pequeno
// menu com os dias da semana ainda não cobertos pelo horário.
export default function DuplicarDiaButton({ id, diasJaCobertos }: { id: string; diasJaCobertos: string[] }) {
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()

  const disponíveis = DIAS.filter(d => !diasJaCobertos.includes(d))
  if (disponíveis.length === 0) return null

  function duplicar(dia: WeekDay) {
    setOpen(false)
    const fd = new FormData()
    fd.append('id', id)
    fd.append('novo_dia', dia)
    start(() => duplicarDiaHorario(fd))
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="Duplicar para outro dia"
        title="Duplicar para outro dia"
        className="text-white/40 hover:text-[#E8B55B] transition-colors p-1 rounded hover:bg-[#E8B55B]/10 disabled:opacity-50"
        disabled={pending}
      >
        {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Copy className="w-3 h-3" />}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-1 z-50 bg-[#1A1A1A] border border-[#E8B55B]/30 rounded-lg shadow-xl p-1 min-w-[110px]">
            {disponíveis.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => duplicar(d)}
                className="block w-full text-left px-2 py-1.5 text-[11px] text-white/70 hover:bg-[#E8B55B]/10 hover:text-[#E8B55B] rounded transition-colors"
              >
                + {WEEKDAY_LABELS_LONG.pt[d]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
