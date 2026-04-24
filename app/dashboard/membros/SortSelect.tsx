'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

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

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(params.toString())
    if (e.target.value && e.target.value !== 'nome_asc') next.set('sort', e.target.value)
    else next.delete('sort')
    router.push(`${pathname}?${next.toString()}`)
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className="px-4 py-2 bg-[#121212] text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer"
    >
      {OPCOES.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
