import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, CreditCard, CalendarDays, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-headline font-bold text-primary tracking-wider">
            IBC ADMIN
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Gestão do Clube</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 hover:bg-primary/10 hover:text-primary text-muted-foreground rounded-md font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Visão Geral
          </Link>
          <Link href="/dashboard/modalidades" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-md font-medium transition-colors">
            <Users className="w-5 h-5" />
            Modalidades
          </Link>
          <Link href="/dashboard/eventos" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-md font-medium transition-colors">
            <CalendarDays className="w-5 h-5" />
            Eventos
          </Link>
          <Link href="/dashboard/loja" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-md font-medium transition-colors">
            <CreditCard className="w-5 h-5" />
            Gestão da Loja
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <form action={async () => {
             'use server'
             const { createClient } = await import('@/lib/supabase/server')
             const { redirect } = await import('next/navigation')
             const supabase = await createClient()
             await supabase.auth.signOut()
             redirect('/login')
          }}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md font-medium transition-colors">
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-border bg-card flex items-center px-8">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
