'use client'

import { useState } from 'react'
import Link, { useLinkStatus } from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, CreditCard, CalendarDays, LogOut,
  ShoppingBag, Activity, ChevronLeft, ChevronRight, Lock, Loader2,
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
  { href: '/dashboard/pagamentos', label: 'Pagamentos', icon: CreditCard, disabled: true },
  { href: '/dashboard/horarios', label: 'Horários', icon: CalendarDays },
  { href: '/dashboard/eventos', label: 'Eventos', icon: CalendarDays, disabled: true },
  { href: '/dashboard/loja', label: 'Loja / Merch', icon: ShoppingBag, disabled: true },
]

const ADVANCED_LINKS: NavItem[] = [
  { href: '/dashboard/logs', label: 'Histórico (Logs)', icon: Activity },
]

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const renderLink = ({ href, label, icon: Icon, disabled }: NavItem) => {
    if (disabled) {
      return (
        <div
          key={href + label}
          title={collapsed ? `${label} (em breve)` : undefined}
          aria-disabled="true"
          className={cn(
            "flex items-center px-4 py-3 rounded-xl font-medium text-white/25 cursor-not-allowed select-none",
            collapsed ? "justify-center" : "gap-4"
          )}
        >
          <Icon className="w-5 h-5 shrink-0" />
          {!collapsed && (
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
        title={collapsed ? label : undefined}
        className={cn(
          "relative flex items-center px-4 py-3 rounded-xl font-medium transition-all group",
          collapsed ? "justify-center" : "gap-4",
          isActive(href)
            ? "bg-[#E8B55B]/10 text-[#E8B55B]"
            : "text-white/60 hover:text-[#E8B55B] hover:bg-white/5"
        )}
      >
        <Icon className="w-5 h-5 shrink-0 group-hover:drop-shadow-[0_0_5px_rgba(232,181,91,0.3)]" />
        {!collapsed && <span className="truncate">{label}</span>}
        <LinkPendingIndicator collapsed={collapsed} />
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        "bg-[#0F0F0F] flex flex-col border-r border-[#E8B55B]/10 shadow-[5px_0_30px_rgba(0,0,0,0.5)] z-20 transition-[width] duration-300",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo */}
      <div className={cn("flex flex-col items-center justify-center border-b border-white/5 relative", collapsed ? "p-4" : "p-8")}>
        <Image
          src="/infanteLogo.png"
          alt="Infante Logo"
          width={collapsed ? 40 : 60}
          height={collapsed ? 40 : 60}
          className="rounded-full shadow-[0_0_15px_rgba(232,181,91,0.4)]"
        />
        {!collapsed && (
          <h2 className="mt-4 text-sm font-headline font-bold text-[#E8B55B] tracking-widest uppercase text-center whitespace-nowrap drop-shadow-[0_0_10px_rgba(232,181,91,0.5)]">
            Infante Boxing Club
          </h2>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(v => !v)}
          aria-label={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#E8B55B]/30 text-[#E8B55B] flex items-center justify-center hover:bg-[#E8B55B]/20 transition-colors shadow-md"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 py-8 space-y-2 overflow-y-auto custom-scrollbar", collapsed ? "px-2" : "px-4")}>
        {MAIN_LINKS.map(renderLink)}

        <div className={cn("pt-8 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/20", collapsed ? "text-center px-1" : "px-4")}>
          {collapsed ? '•' : 'Avançado'}
        </div>

        {ADVANCED_LINKS.map(renderLink)}
      </nav>

      {/* Logout */}
      <div className={cn("border-t border-white/5", collapsed ? "p-3" : "p-6")}>
        <form action={logout}>
          <button
            type="submit"
            title={collapsed ? 'Logout' : undefined}
            className={cn(
              "w-full flex items-center px-4 py-3 text-white/50 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 rounded-xl font-medium transition-all",
              collapsed ? "justify-center" : "justify-center gap-3"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && 'Logout'}
          </button>
        </form>
      </div>
    </aside>
  )
}
