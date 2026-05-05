'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { RotateCcw } from 'lucide-react'

// ─── BARRA DE PERSISTÊNCIA + RESET DE FILTROS ───────────────────
// 1. Persiste os search params actuais em localStorage para que ao
//    sair da página e voltar, os mesmos filtros voltem a aplicar-se.
// 2. Se o utilizador chega à página sem search params (URL "limpa")
//    mas há filtros guardados, faz um router.replace para os aplicar.
// 3. Mostra um botão "Limpar filtros" que aparece SÓ se houver
//    filtros activos. Click → limpa localStorage e remove search params.
//
// Os filtros vivem em URL search params como antes — esta camada só
// adiciona persistência opcional. Bookmarks de URLs específicas
// continuam a funcionar.

const STORAGE_KEY = 'ibc:membros-filters'

// Lista exaustiva de chaves que consideramos "filtros" (não inclui
// `error` ou outros params transientes).
const FILTER_KEYS = ['turma', 'q', 'status', 'seguro', 'inspecao', 'estado', 'sort'] as const

function readStored(): Record<string, string> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function writeStored(data: Record<string, string>) {
  try {
    if (Object.keys(data).length === 0) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* noop */ }
}

export default function MembrosFiltersBar() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const [restored, setRestored] = useState(false)
  const didRestoreRef = useRef(false)

  // Filtros actuais na URL (apenas os reconhecidos).
  const currentFilters: Record<string, string> = {}
  for (const k of FILTER_KEYS) {
    const v = sp.get(k)
    if (v) currentFilters[k] = v
  }
  const hasActiveFilters = Object.keys(currentFilters).length > 0

  // 1. Restaurar de localStorage no primeiro mount, se URL está limpa.
  useEffect(() => {
    if (didRestoreRef.current) return
    didRestoreRef.current = true
    if (hasActiveFilters) {
      setRestored(true)
      return
    }
    const stored = readStored()
    if (stored && Object.keys(stored).length > 0) {
      const params = new URLSearchParams()
      for (const [k, v] of Object.entries(stored)) {
        if (v) params.set(k, v)
      }
      router.replace(`${pathname}?${params.toString()}`)
    } else {
      setRestored(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2. Persistir filtros actuais em localStorage sempre que mudam.
  useEffect(() => {
    if (!didRestoreRef.current) return
    writeStored(currentFilters)
    setRestored(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.toString()])

  function handleReset() {
    writeStored({})
    router.push(pathname)
  }

  if (!hasActiveFilters || !restored) return null

  // Resumir filtros activos para o badge
  const count = Object.keys(currentFilters).length

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
        {count} filtro{count !== 1 ? 's' : ''} activo{count !== 1 ? 's' : ''}
      </span>
      <button
        type="button"
        onClick={handleReset}
        title="Limpar todos os filtros"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 hover:border-red-500/30 transition-all text-[11px] font-bold uppercase tracking-wider"
      >
        <RotateCcw className="w-3 h-3" />
        Limpar
      </button>
    </div>
  )
}
