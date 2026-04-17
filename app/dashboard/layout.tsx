import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, CreditCard, CalendarDays, LogOut, Settings, BarChart, ShoppingBag, Activity } from "lucide-react";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-white/90 selection:bg-[#E8B55B]/30 font-sans">
      
      {/* Sidebar sidebar */}
      <aside className="w-72 bg-[#0F0F0F] flex flex-col border-r border-[#E8B55B]/10 shadow-[5px_0_30px_rgba(0,0,0,0.5)] z-20">
        
        {/* Logo Area */}
        <div className="p-8 flex flex-col items-center justify-center border-b border-white/5">
          <Image src="/infanteLogo.png" alt="Infante Logo" width={60} height={60} className="rounded-full shadow-[0_0_15px_rgba(232,181,91,0.4)] mb-4" />
          <h2 className="text-xl font-headline font-bold text-[#E8B55B] tracking-widest uppercase text-center drop-shadow-[0_0_10px_rgba(232,181,91,0.5)]">
            Infante<br/>
            <span className="text-xs text-white/70">Boxing Club</span>
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          
          <Link href="/dashboard" className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 text-white/60 hover:text-[#E8B55B] rounded-xl font-medium transition-all group">
            <LayoutDashboard className="w-5 h-5 group-hover:drop-shadow-[0_0_5px_rgba(232,181,91,0.3)]" />
            Geral
          </Link>
          
          <Link href="/dashboard/membros" className="flex items-center gap-4 px-4 py-3 text-white/60 hover:text-[#E8B55B] hover:bg-white/5 rounded-xl font-medium transition-all group">
            <Users className="w-5 h-5 group-hover:drop-shadow-[0_0_5px_rgba(232,181,91,0.3)]" />
            Membros
          </Link>

          <Link href="/dashboard/horarios" className="flex items-center gap-4 px-4 py-3 text-white/60 hover:text-[#E8B55B] hover:bg-white/5 rounded-xl font-medium transition-all group">
            <CalendarDays className="w-5 h-5 group-hover:drop-shadow-[0_0_5px_rgba(232,181,91,0.3)]" />
            Horários
          </Link>

          <Link href="/dashboard/eventos" className="flex items-center gap-4 px-4 py-3 text-white/60 hover:text-[#E8B55B] hover:bg-white/5 rounded-xl font-medium transition-all group">
            <CalendarDays className="w-5 h-5 group-hover:drop-shadow-[0_0_5px_rgba(232,181,91,0.3)]" />
            Eventos
          </Link>

          <Link href="/dashboard/loja" className="flex items-center gap-4 px-4 py-3 text-white/60 hover:text-[#E8B55B] hover:bg-white/5 rounded-xl font-medium transition-all group">
            <ShoppingBag className="w-5 h-5 group-hover:drop-shadow-[0_0_5px_rgba(232,181,91,0.3)]" />
            Loja / Merch
          </Link>

          <div className="pt-8 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-white/20">Avançado</div>

          <Link href="/dashboard/logs" className="flex items-center gap-4 px-4 py-3 text-white/60 hover:text-[#E8B55B] hover:bg-white/5 rounded-xl font-medium transition-all group">
            <Activity className="w-5 h-5 group-hover:drop-shadow-[0_0_5px_rgba(232,181,91,0.3)]" />
            Histórico (Logs)
          </Link>

          <Link href="#" className="flex items-center gap-4 px-4 py-3 text-white/60 hover:text-[#E8B55B] hover:bg-white/5 rounded-xl font-medium transition-all group">
            <Settings className="w-5 h-5 group-hover:drop-shadow-[0_0_5px_rgba(232,181,91,0.3)]" />
            Definições
          </Link>

        </nav>

        {/* Logout area */}
        <div className="p-6 border-t border-white/5">
          <form action={async () => {
             'use server'
             const { createClient } = await import('@/lib/supabase/server')
             const { redirect } = await import('next/navigation')
             const supabase = await createClient()
             await supabase.auth.signOut()
             redirect('/login')
          }}>
            <button type="submit" className="w-full flex items-center justify-center gap-3 px-4 py-3 text-white/50 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 rounded-xl font-medium transition-all">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
         {/* Background ambient light */}
         <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#E8B55B]/5 to-transparent pointer-events-none" />

        <div className="p-10 max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
