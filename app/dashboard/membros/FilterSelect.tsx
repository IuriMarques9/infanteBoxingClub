'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function FilterSelect({
  param,
  value,
  options,
  label,
}: {
  param: string
  value: string
  options: { value: string; label: string }[]
  label?: string
}) {
  const router = useRouter()
  const params = useSearchParams()
  const pathname = usePathname()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(params.toString())
    if (e.target.value) next.set(param, e.target.value)
    else next.delete(param)
    router.push(`${pathname}?${next.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-white/40 text-xs uppercase tracking-wider">{label}:</span>
      )}
      <select
        value={value}
        onChange={handleChange}
        className="px-4 py-2 bg-[#121212] text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
