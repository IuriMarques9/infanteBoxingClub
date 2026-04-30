'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { getActivityLabel, getEntityLabel } from '@/lib/activity-log-labels'

export default function LogFilters({
  availableActions,
  availableAdmins,
  availableEntities,
}: {
  availableActions: string[]
  availableAdmins: { id: string; label: string }[]
  availableEntities: string[]
}) {
  const router = useRouter()
  const sp = useSearchParams()
  const [pending, startTransition] = useTransition()

  function set(k: string, v: string) {
    const params = new URLSearchParams(sp.toString())
    if (v) params.set(k, v)
    else params.delete(k)
    params.delete('page')
    startTransition(() => {
      router.push(`/dashboard/logs?${params.toString()}`)
    })
  }

  function clearAll() {
    startTransition(() => {
      router.push('/dashboard/logs')
    })
  }

  const hasFilters = Boolean(
    sp.get('action') || sp.get('admin') || sp.get('entity') || sp.get('from') || sp.get('to')
  )

  // Pré-ordenar os labels para apresentação (em PT, sem dependências do
  // código bruto vindo da BD).
  const actionsByLabel = availableActions
    .map(code => ({ code, label: getActivityLabel(code).label }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const entitiesByLabel = availableEntities
    .map(code => ({ code, label: getEntityLabel(code) }))
    .sort((a, b) => a.label.localeCompare(b.label))

  return (
    <div className="relative">
      <div className={`flex flex-wrap gap-3 p-4 bg-[#121212] rounded-2xl border border-white/5 transition-opacity ${pending ? 'opacity-60' : ''}`}>
        <select
          value={sp.get('action') || ''}
          onChange={(e) => set('action', e.target.value)}
          disabled={pending}
          className="px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-sm appearance-none disabled:cursor-wait"
        >
          <option value="">Todas as ações</option>
          {actionsByLabel.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={sp.get('admin') || ''}
          onChange={(e) => set('admin', e.target.value)}
          disabled={pending}
          className="px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-sm appearance-none disabled:cursor-wait"
        >
          <option value="">Todos os admins</option>
          {availableAdmins.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>

        <select
          value={sp.get('entity') || ''}
          onChange={(e) => set('entity', e.target.value)}
          disabled={pending}
          className="px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-sm appearance-none disabled:cursor-wait"
        >
          <option value="">Todas as entidades</option>
          {entitiesByLabel.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={sp.get('from') || ''}
          onChange={(e) => set('from', e.target.value)}
          disabled={pending}
          className="px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-sm [color-scheme:dark] disabled:cursor-wait"
        />

        <input
          type="date"
          value={sp.get('to') || ''}
          onChange={(e) => set('to', e.target.value)}
          disabled={pending}
          className="px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-sm [color-scheme:dark] disabled:cursor-wait"
        />

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            disabled={pending}
            className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-[#E8B55B] transition-colors disabled:opacity-40"
          >
            Limpar
          </button>
        )}

        {pending && (
          <span className="inline-flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#E8B55B]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            A filtrar…
          </span>
        )}
      </div>

      {/* Barra animada por baixo dos filtros enquanto a página recarrega.
          Dá feedback claro de que o servidor está a responder à mudança. */}
      {pending && (
        <div className="absolute -bottom-px left-4 right-4 h-[2px] overflow-hidden rounded-full bg-[#E8B55B]/10">
          <div className="h-full w-full bg-[#E8B55B] animate-pulse" />
        </div>
      )}
    </div>
  )
}
