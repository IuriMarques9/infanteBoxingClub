'use client'

import { useEffect, useState } from 'react'
import Link, { useLinkStatus } from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, CreditCard, CalendarDays, LogOut,
  ShoppingBag, Activity, ChevronLeft, ChevronRight, Lock, Loader2,
  Menu, X, ShieldCheck,
} from 'lucide-react'
import { logout } from '@/app/login/actions'
import { cn } from '@/lib/utils'

function LinkPendingIndicator({ collapsed }: { collapsed: boolean }) {
  const { pending } = useLinkStatus()
  if (!pending) return null
  return (
    <Loader2
      className={cn(
        'w-4 h-4 animate-spin text-[#E8B55B] shrink-0',
        collapsed ? 'absolute -top-1 -right-1' : 'ml-auto',
      )}
    />
  )
}

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  disabled?: boolean
}

const MAIN_LINKS: NavItem[] = [
  { href: '/dashboard', label: 'Geral', icon: LayoutDashboard },
  { href: '/dashboard/membros', label: 'Membros', icon: Users },
  { href: '/dashboard/pagamentos', label: 'Pagamentos', icon: CreditCard },
  { href: '/dashboard/horarios', label: 'Horários', icon: CalendarDays },
  { href: '/dashboard/eventos', label: 'Eventos', icon: CalendarDays, disabled: true },
  { href: '/dashboard/loja', label: 'Loja / Merch', icon: ShoppingBag, disabled: true },
]

// Item Administradores só aparece para o super admin (filtrado em runtime)
const ADVANCED_LINKS_BASE: NavItem[] = [
  { href: '/dashboard/admins', label: 'Administradores', icon: ShieldCheck },
  { href: '/dashboard/logs', label: 'Histórico (Logs)', icon: Activity },
]

export default function DashboardSidebar({ isSuperAdmin = false }: { isSuperAdmin?: boolean }) {
  const ADVANCED_LINKS = isSuperAdmin
    ? ADVANCED_LINKS_BASE
    : ADVANCED_LINKS_BASE.filter(l => l.href !== '/dashboard/admins')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Detect mobile viewport
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches)
    handler(mql)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Lock body scroll when drawer open
  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = original }
    }
  }, [mobileOpen])

  const effectivelyCollapsed = !isMobile && collapsed

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const renderLink = ({ href, label, icon: Icon, disabled }: NavItem) => {
    if (disabled) {
      return (
        <div
          key={href + label}
          title={effectivelyCollapsed ? `${label} (em breve)` : undefined}
          aria-disabled="true"
          className={cn(
            "flex items-center px-4 py-3 rounded-xl font-medium text-white/25 cursor-not-allowed select-none",
            effectivelyCollapsed ? "justify-center" : "gap-4"
          )}
        >
          <Icon className="w-5 h-5 shrink-0" />
          {!effectivelyCollapsed && (
            <>
              <span className="truncate">{label}</span>
              <Lock className="w-3.5 h-3.5 ml-auto shrink-0 text-white/20" />
            </>
          )}
        </div>
      )
    }
    return (
      <Link
        key={href + label}
        href={href}
        title={effectivelyCollapsed ? label : undefined}
        className={cn(
          "relative flex items-center px-4 py-3 rounded-xl font-medium transition-all group",
          effectivelyCollapsed ? "justify-center" : "gap-4",
          isActive(href)
            ? "bg-[#E8B55B]/10 text-[#E8B55B]"
            : "text-white/60 hover:text-[#E8B55B] hover:bg-white/5"
        )}
      >
        <Icon className="w-5 h-5 shrink-0 group-hover:drop-shadow-[0_0_5px_rgba(232,181,91,0.3)]" />
        {!effectivelyCollapsed && <span className="truncate">{label}</span>}
        <LinkPendingIndicator collapsed={effectivelyCollapsed} />
      </Link>
    )
  }

  return (
    <>
      {/* Mobile hamburger trigger — only visible below md */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
        className="md:hidden fixed top-4 left-4 z-40 w-11 h-11 rounded-xl bg-[#1A1A1A]/95 backdrop-blur border border-[#E8B55B]/30 text-[#E8B55B] flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.5)] active:scale-95 transition-transform"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        />
      )}

      <aside
        className={cn(
          "bg-[#0F0F0F] flex flex-col border-r border-[#E8B55B]/10 shadow-[5px_0_30px_rgba(0,0,0,0.5)]",
          // Mobile: fixed slide-in drawer
          "fixed inset-y-0 left-0 w-72 z-50 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: static and width-toggleable
          "md:static md:translate-x-0 md:z-20 md:transition-[width]",
          collapsed ? "md:w-20" : "md:w-72"
        )}
      >
        {/* Close button — only on mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Fechar menu"
          className="md:hidden absolute top-4 right-4 z-10 w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo */}
        <div className={cn(
          "flex flex-col items-center justify-center border-b border-white/5 relative",
          effectivelyCollapsed ? "p-4" : "p-8"
        )}>
          <Image
            src="/infanteLogo.png"
            alt="Infante Logo"
            width={effectivelyCollapsed ? 40 : 60}
            height={effectivelyCollapsed ? 40 : 60}
            className="rounded-full shadow-[0_0_15px_rgba(232,181,91,0.4)]"
          />
          {!effectivelyCollapsed && (
            <h2 className="mt-4 text-sm font-headline font-bold text-[#E8B55B] tracking-widest uppercase text-center whitespace-nowrap drop-shadow-[0_0_10px_rgba(232,181,91,0.5)]">
              Infante Boxing Club
            </h2>
          )}
          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(v => !v)}
            aria-label={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
            className="hidden md:flex absolute -right-3 top-10 w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#E8B55B]/30 text-[#E8B55B] items-center justify-center hover:bg-[#E8B55B]/20 transition-colors shadow-md"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 py-8 space-y-2 overflow-y-auto custom-scrollbar",
          effectivelyCollapsed ? "px-2" : "px-4"
        )}>
          {MAIN_LINKS.map(renderLink)}

          <div className={cn(
            "pt-8 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/20",
            effectivelyCollapsed ? "text-center px-1" : "px-4"
          )}>
            {effectivelyCollapsed ? '•' : 'Avançado'}
          </div>

          {ADVANCED_LINKS.map(renderLink)}
        </nav>

        {/* Logout */}
        <div className={cn(
          "border-t border-white/5",
          effectivelyCollapsed ? "p-3" : "p-6"
        )}>
          <form action={logout}>
            <button
              type="submit"
              title={effectivelyCollapsed ? 'Logout' : undefined}
              className={cn(
                "w-full flex items-center px-4 py-3 text-white/50 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 rounded-xl font-medium transition-all",
                effectivelyCollapsed ? "justify-center" : "justify-center gap-3"
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!effectivelyCollapsed && 'Logout'}
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
