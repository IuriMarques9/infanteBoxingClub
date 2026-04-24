'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Loader2, Search, X } from 'lucide-react'

export default function SearchInput({ initial = '' }: { initial?: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const pathname = usePathname()
  const [value, setValue] = useState(initial)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const handle = setTimeout(() => {
      const current = params.get('q') || ''
      if (value === current) return
      const next = new URLSearchParams(params.toString())
      if (value.trim()) next.set('q', value.trim())
      else next.delete('q')
      startTransition(() => {
        router.push(`${pathname}?${next.toString()}`)
      })
    }, 300)
    return () => clearTimeout(handle)
  }, [value, params, pathname, router])

  return (
    <div className="flex-1 relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Pesquisar por nome..."
        className="w-full pl-12 pr-12 py-3 bg-[#121212] text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent placeholder:text-white/30 text-sm"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {isPending && <Loader2 className="w-4 h-4 text-[#E8B55B] animate-spin" />}
        {value && !isPending && (
          <button
            type="button"
            onClick={() => setValue('')}
            aria-label="Limpar pesquisa"
            className="text-white/30 hover:text-white/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
