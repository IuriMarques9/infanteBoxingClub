'use client'
import { useRouter, useSearchParams } from 'next/navigation'

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

  function set(k: string, v: string) {
    const params = new URLSearchParams(sp.toString())
    if (v) params.set(k, v)
    else params.delete(k)
    params.delete('page')
    router.push(`/dashboard/logs?${params.toString()}`)
  }

  function clearAll() {
    router.push('/dashboard/logs')
  }

  const hasFilters = Boolean(
    sp.get('action') || sp.get('admin') || sp.get('entity') || sp.get('from') || sp.get('to')
  )

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-[#121212] rounded-2xl border border-white/5">
      <select
        value={sp.get('action') || ''}
        onChange={(e) => set('action', e.target.value)}
        className="px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-sm appearance-none"
      >
        <option value="">Todas as ações</option>
        {availableActions.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <select
        value={sp.get('admin') || ''}
        onChange={(e) => set('admin', e.target.value)}
        className="px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-sm appearance-none"
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
        className="px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-sm appearance-none"
      >
        <option value="">Todas as entidades</option>
        {availableEntities.map((e_) => (
          <option key={e_} value={e_}>
            {e_}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={sp.get('from') || ''}
        onChange={(e) => set('from', e.target.value)}
        className="px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-sm [color-scheme:dark]"
      />

      <input
        type="date"
        value={sp.get('to') || ''}
        onChange={(e) => set('to', e.target.value)}
        className="px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-sm [color-scheme:dark]"
      />

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-[#E8B55B] transition-colors"
        >
          Limpar
        </button>
      )}
    </div>
  )
}
