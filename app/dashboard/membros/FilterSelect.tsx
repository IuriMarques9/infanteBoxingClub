'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

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
  const [pending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(params.toString())
    if (e.target.value) next.set(param, e.target.value)
    else next.delete(param)
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`)
    })
  }

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-white/40 text-xs uppercase tracking-wider">{label}:</span>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={handleChange}
          disabled={pending}
          className={`px-4 py-2 ${pending ? 'pr-9' : ''} bg-[#121212] text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer disabled:cursor-wait disabled:opacity-70 transition-opacity`}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {pending && (
          <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#E8B55B] animate-spin pointer-events-none" />
        )}
      </div>
    </div>
  )
}
