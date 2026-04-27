import { listAdmins } from './actions'
import { createClient } from '@/lib/supabase/server'
import AdminsListClient from './AdminsListClient'
import { Users } from 'lucide-react'

export const metadata = { title: 'Administradores | Dashboard' }
export const dynamic = 'force-dynamic'

export default async function AdminsPage() {
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
