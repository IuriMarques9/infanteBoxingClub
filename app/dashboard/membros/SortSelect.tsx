'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const OPCOES = [
  { value: 'nome_asc', label: 'Nome (A-Z)' },
  { value: 'nome_desc', label: 'Nome (Z-A)' },
  { value: 'turma_asc', label: 'Turma (Gatinhos → Mulheres)' },
  { value: 'turma_desc', label: 'Turma (Mulheres → Gatinhos)' },
  { value: 'seguro_falta', label: 'Seguro em falta primeiro' },
  { value: 'seguro_pago', label: 'Seguro pago primeiro' },
  { value: 'inspecao_falta', label: 'Inspeção em falta primeiro' },
  { value: 'inspecao_feita', label: 'Inspeção feita primeiro' },
  { value: 'inativos_primeiro', label: 'Inativos primeiro' },
]

export default function SortSelect({ value }: { value: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(params.toString())
    if (e.target.value && e.target.value !== 'nome_asc') next.set('sort', e.target.value)
    else next.delete('sort')
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`)
    })
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={handleChange}
        disabled={pending}
        className={`px-4 py-2 ${pending ? 'pr-9' : ''} bg-[#121212] text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer disabled:cursor-wait disabled:opacity-70 transition-opacity`}
      >
        {OPCOES.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {pending && (
        <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#E8B55B] animate-spin pointer-events-none" />
      )}
    </div>
  )
}
