'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Bookmark, Plus, Trash2, Star } from 'lucide-react'

// ─── PRESETS DE FILTROS GUARDADOS (D4) ─────────────────────────
// Guarda combos de querystring em localStorage; permite criar a
// partir do filtro atual e aplicar com um clique. Por defeito traz
// dois presets úteis: "Eliminações esta semana" e "Apenas pagamentos".

interface Preset {
  name: string
  query: string  // querystring (sem '?')
}

const STORAGE_KEY = 'ibc:logs-presets'

const DEFAULTS: Preset[] = [
  { name: 'Eliminações (7 dias)', query: buildDefault('ELIMINAR_MEMBRO', 7) },
  { name: 'Apenas pagamentos',    query: 'action=REGISTAR_PAGAMENTO' },
]

function buildDefault(action: string, daysBack: number): string {
  const from = new Date()
  from.setDate(from.getDate() - daysBack)
  // Apenas action; o "from" para 'Eliminações 7 dias' fica simbólico
  // (a data muda dinamicamente quando o preset é construído).
  return `action=${action}&from=${from.toISOString().slice(0, 10)}`
}

function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return DEFAULTS
    return parsed
  } catch {
    return DEFAULTS
  }
}

export default function SavedFilters() {
  const router = useRouter()
  const sp = useSearchParams()
  const [presets, setPresets] = useState<Preset[]>([])
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    setPresets(loadPresets())
  }, [])

  function persist(next: Preset[]) {
    setPresets(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* noop */ }
  }

  function apply(query: string) {
    router.push(`/dashboard/logs${query ? `?${query}` : ''}`)
  }

  function saveCurrent() {
    if (!name.trim()) return
    const current = sp.toString()
    if (!current) return
    persist([...presets, { name: name.trim(), query: current }])
    setName('')
    setAdding(false)
  }

  function remove(idx: number) {
    persist(presets.filter((_, i) => i !== idx))
  }

  const currentQuery = sp.toString()
  const canSave = currentQuery.length > 0

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
        <Bookmark className="w-3 h-3" /> Presets
      </span>
      {presets.map((p, i) => (
        <span key={`${p.name}-${i}`} className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => apply(p.query)}
            className="px-3 py-1.5 text-[11px] text-white/70 hover:text-[#E8B55B] hover:bg-[#E8B55B]/5 transition-colors"
            title={p.query || '(sem filtros)'}
          >
            {p.name}
          </button>
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label={`Remover preset ${p.name}`}
            className="px-2 py-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors border-l border-white/10"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </span>
      ))}
      {adding ? (
        <span className="inline-flex items-center bg-[#1A1A1A] border border-[#E8B55B]/30 rounded-lg overflow-hidden">
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveCurrent(); if (e.key === 'Escape') setAdding(false) }}
            placeholder="Nome…"
            className="px-3 py-1.5 bg-transparent text-white text-[11px] focus:outline-none w-32"
          />
          <button
            type="button"
            onClick={saveCurrent}
            disabled={!name.trim()}
            className="px-2 py-1.5 text-[#E8B55B] hover:bg-[#E8B55B]/10 disabled:opacity-30 transition-colors border-l border-white/10"
            aria-label="Guardar preset"
          >
            <Star className="w-3 h-3" />
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          disabled={!canSave}
          title={canSave ? 'Guardar filtros atuais como preset' : 'Aplica filtros primeiro'}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-white/40 hover:text-[#E8B55B] hover:bg-[#E8B55B]/5 rounded-lg border border-dashed border-white/10 hover:border-[#E8B55B]/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-3 h-3" /> Guardar
        </button>
      )}
    </div>
  )
}
