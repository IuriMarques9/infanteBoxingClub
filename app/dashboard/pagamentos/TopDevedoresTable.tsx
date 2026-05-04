import Link from 'next/link'
import { Trophy, ChevronRight } from 'lucide-react'
import { TURMA_LABELS, type Turma } from '@/app/dashboard/membros/constants'

interface Props {
  devedores: { membro_id: string; nome: string; turma: string; mesesEmAtraso: number; valorEmAtraso: number }[]
  year: number
}

export default function TopDevedoresTable({ devedores, year }: Props) {
  if (devedores.length === 0) {
    return (
      <div className="bg-[#121212] rounded-2xl border border-white/5 p-8 shadow-xl text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-300">
          <Trophy className="w-5 h-5" />
        </div>
        <p className="text-emerald-200/90 font-medium">Sem devedores em {year}.</p>
        <p className="text-white/40 text-xs mt-1">Todos os atletas estão em dia.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
      <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
        <Trophy className="w-4 h-4 text-amber-300" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-amber-300">Top Devedores · {year}</h3>
        <span className="ml-auto text-[10px] text-white/40 uppercase tracking-widest">por meses em atraso</span>
      </div>
      <ol className="divide-y divide-white/5">
        {devedores.map((d, i) => (
          <li key={d.membro_id}>
            <Link
              href={`/dashboard/membros/${d.membro_id}`}
              className="flex items-center gap-3 p-3 sm:p-4 hover:bg-white/[0.02] transition-colors group"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i === 0 ? 'bg-amber-300 text-black' :
                i === 1 ? 'bg-zinc-300 text-black' :
                i === 2 ? 'bg-amber-700/60 text-white' :
                          'bg-white/5 text-white/50'
              }`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/90 font-medium truncate group-hover:text-[#E8B55B] transition-colors">{d.nome}</p>
                <p className="text-[11px] text-white/40 truncate">{TURMA_LABELS[d.turma as Turma] ?? d.turma}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-amber-300 font-bold text-sm">{d.mesesEmAtraso} {d.mesesEmAtraso === 1 ? 'mês' : 'meses'}</p>
                <p className="text-[10px] text-white/40">{d.valorEmAtraso}€ em dívida</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#E8B55B] shrink-0" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
