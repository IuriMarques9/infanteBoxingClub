import { listAdmins } from './actions'
import { createClient } from '@/lib/supabase/server'
import { currentUserIsSuperAdmin } from '@/lib/auth'
import AdminsListClient from './AdminsListClient'
import { Users, Lock } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Administradores | Dashboard' }
export const dynamic = 'force-dynamic'

export default async function AdminsPage() {
  // Acesso restrito ao super admin (definido em SUPER_ADMIN_EMAIL).
  // Se a env var não estiver configurada, ninguém entra.
  const isSuper = await currentUserIsSuperAdmin()
  if (!isSuper) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-300">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-headline font-bold text-[#E8B55B] tracking-wider">
          Acesso restrito
        </h1>
        <p className="text-white/60 text-sm">
          Esta página é gerida apenas pelo administrador principal do clube.
          Se precisares de criar uma nova conta de administrador ou repor uma password,
          contacta-o.
        </p>
        <Link
          href="/dashboard"
          className="inline-block mt-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-[#E8B55B] bg-[#E8B55B]/10 border border-[#E8B55B]/20 hover:bg-[#E8B55B]/20 transition-all"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    )
  }

  const admins = await listAdmins()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentId = user?.id

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-[#E8B55B] tracking-wider flex items-center gap-3">
          <Users className="w-7 h-7" /> Administradores
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Quem consegue entrar na dashboard. Cada ação é registada com o admin que a executou.
        </p>
      </div>

      <AdminsListClient admins={admins} currentId={currentId ?? null} />
    </div>
  )
}
