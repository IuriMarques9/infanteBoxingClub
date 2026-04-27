'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, Users, LayoutDashboard, CalendarDays, Activity, FileText,
  CornerDownLeft, X, ShieldCheck,
} from 'lucide-react'

// ─── COMMAND PALETTE (E2) ──────────────────────────────────────
// Atalho global Ctrl/⌘+K. Pesquisa membros pelo nome (fetch da
// API do Supabase via server action) + ações rápidas de navegação.
// Implementado sem `cmdk` para evitar uma dependência grande;
// teclado: ↑↓ navega, Enter abre, Esc fecha.

interface MemberHit {
  id: string
  nome: string
  turma: string | null
}

interface QuickAction {
  type: 'action'
  label: string
  hint?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const QUICK_ACTIONS_BASE: QuickAction[] = [
  { type: 'action', label: 'Geral',     href: '/dashboard',           icon: LayoutDashboard },
  { type: 'action', label: 'Membros',   href: '/dashboard/membros',   icon: Users },
  { type: 'action', label: 'Novo Membro', href: '/dashboard/membros/novo', icon: Users, hint: 'Criar' },
  { type: 'action', label: 'Horários',  href: '/dashboard/horarios',  icon: CalendarDays },
  { type: 'action', label: 'Administradores', href: '/dashboard/admins', icon: ShieldCheck },
  { type: 'action', label: 'Logs',      href: '/dashboard/logs',      icon: Activity },
  { type: 'action', label: 'Inativos',  href: '/dashboard/membros?estado=inativo', icon: Users, hint: 'Filtro' },
]

export default function CommandPalette({
  allMembers,
  isSuperAdmin = false,
}: {
  allMembers: { id: string; nome: string; turma: string | null }[]
  isSuperAdmin?: boolean
}) {
  const QUICK_ACTIONS = isSuperAdmin
    ? QUICK_ACTIONS_BASE
    : QUICK_ACTIONS_BASE.filter(a => a.href !== '/dashboard/admins')
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Atalho global Ctrl/Cmd + K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) {
      setQ('')
      setActiveIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const memberHits: MemberHit[] = useMemo(() => {
    if (!q.trim()) return []
    const lower = q.toLowerCase()
    return allMembers
      .filter(m => m.nome.toLowerCase().includes(lower))
      .slice(0, 8)
      .map(m => ({ id: m.id, nome: m.nome, turma: m.turma }))
  }, [allMembers, q])

  const actionHits = useMemo(() => {
    if (!q.trim()) return QUICK_ACTIONS
    const lower = q.toLowerCase()
    return QUICK_ACTIONS.filter(a => a.label.toLowerCase().includes(lower))
  }, [q])

  // Lista combinada: membros primeiro (se há query), depois ações
  const items = useMemo(() => {
    return [
      ...memberHits.map(m => ({ kind: 'member' as const, ...m })),
      ...actionHits.map(a => ({ kind: 'action' as const, ...a })),
    ]
  }, [memberHits, actionHits])

  function go(idx: number) {
    const it = items[idx]
    if (!it) return
    if (it.kind === 'member') router.push(`/dashboard/membros/${it.id}`)
    else router.push(it.href)
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(activeIdx)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir paleta de comandos (Ctrl+K)"
        title="Procurar (Ctrl+K)"
        className="hidden md:inline-flex fixed bottom-6 right-6 z-30 items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#E8B55B]/30 text-white/60 hover:text-[#E8B55B] hover:border-[#E8B55B] shadow-2xl backdrop-blur transition-colors text-xs"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Procurar</span>
        <kbd className="ml-2 px-1.5 py-0.5 text-[9px] font-bold bg-white/5 border border-white/10 rounded">⌘K</kbd>
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4 bg-black/70 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-[#0F0F0F] border border-[#E8B55B]/20 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] w-full max-w-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search className="w-4 h-4 text-[#E8B55B] shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={e => { setQ(e.target.value); setActiveIdx(0) }}
            onKeyDown={onKeyDown}
            placeholder="Procurar membros ou navegar…"
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-white/30"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar"
            className="text-white/30 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto py-2 custom-scrollbar">
          {items.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-white/40">Nenhum resultado.</p>
          ) : (
            items.map((it, idx) => {
              const active = idx === activeIdx
              const baseCls = `flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${active ? 'bg-[#E8B55B]/10 text-[#E8B55B]' : 'text-white/70 hover:bg-white/5'}`
              if (it.kind === 'member') {
                return (
                  <button
                    type="button"
                    key={`m-${it.id}`}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => go(idx)}
                    className={`w-full text-left ${baseCls}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#E8B55B]/10 border border-[#E8B55B]/20 flex items-center justify-center text-[10px] font-bold text-[#E8B55B] shrink-0">
                      {it.nome.charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-1 text-sm truncate">{it.nome}</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/30">{it.turma || ''}</span>
                    {active && <CornerDownLeft className="w-3 h-3 text-white/40" />}
                  </button>
                )
              }
              const Icon = it.icon
              return (
                <button
                  type="button"
                  key={`a-${it.label}`}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => go(idx)}
                  className={`w-full text-left ${baseCls}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-sm">{it.label}</span>
                  {it.hint && <span className="text-[10px] uppercase tracking-wider text-white/30">{it.hint}</span>}
                  {active && <CornerDownLeft className="w-3 h-3 text-white/40" />}
                </button>
              )
            })
          )}
        </div>
        <div className="px-4 py-2 border-t border-white/10 text-[10px] text-white/30 flex items-center justify-between">
          <span>Ctrl/⌘K para reabrir · ↑↓ navega · Enter abre</span>
          <span>{items.length} resultado{items.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  )
}
