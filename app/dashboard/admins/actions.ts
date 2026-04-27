'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { currentUserIsSuperAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const NOT_AUTHORIZED = { error: 'Apenas o administrador principal pode gerir contas de admin.' }

// ─── GESTÃO DE ADMINISTRADORES ──────────────────────────────────
// Cria/lista/elimina contas que conseguem entrar na dashboard.
// Usa o SUPABASE_SERVICE_ROLE_KEY (cliente admin) para listar e
// criar utilizadores em `auth.users`. A trigger `on_auth_user_created`
// (em schema.sql) popula automaticamente a tabela `profiles`.

export interface AdminRow {
  id: string
  email: string
  role: string | null
  last_sign_in_at: string | null
  created_at: string
}

export async function listAdmins(): Promise<AdminRow[]> {
  // Apenas o super admin pode listar contas — os outros nem sequer
  // veem a página, mas defensiva extra: devolve [] se não autorizado.
  if (!(await currentUserIsSuperAdmin())) return []

  const admin = createAdminClient()

  // Tabela profiles tem 1 linha por user. Faz JOIN com auth.users
  // para obter timestamps. O Supabase não expõe auth.users via SQL
  // public, então usamos a Admin API.
  const { data: authData } = await admin.auth.admin.listUsers({ perPage: 200 })
  const authUsers = authData?.users || []

  const supabase = await createClient()
  const { data: profiles } = await (supabase
    .from('profiles')
    .select('id, email, role') as any)

  const profMap = new Map<string, any>((profiles || []).map((p: any) => [p.id, p]))

  return authUsers.map(u => ({
    id: u.id,
    email: u.email || '(sem email)',
    role: profMap.get(u.id)?.role ?? 'admin',
    last_sign_in_at: u.last_sign_in_at ?? null,
    created_at: u.created_at,
  })).sort((a, b) => a.email.localeCompare(b.email))
}

// Cria uma nova conta de admin já confirmada (sem precisar do email
// de confirmação). A password é definida pelo criador. A trigger
// vai popular `profiles` automaticamente.
export async function criarAdmin(formData: FormData): Promise<{ ok?: boolean; error?: string }> {
  if (!(await currentUserIsSuperAdmin())) return NOT_AUTHORIZED
  const email = (formData.get('email') as string || '').trim().toLowerCase()
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Email e password obrigatórios.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Email inválido.' }
  if (password.length < 8) return { error: 'Password tem de ter pelo menos 8 caracteres.' }

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,  // já confirmado — pode fazer login imediato
  })
  if (error) return { error: error.message }

  // Log da ação
  const supabase = await createClient()
  await (supabase.from('activity_log') as any).insert({
    action: 'CRIAR_ADMIN',
    description: `Criou administrador "${email}"`,
    entity_type: 'admin',
    entity_id: data.user?.id,
  })

  revalidatePath('/dashboard/admins')
  return { ok: true }
}

export async function eliminarAdmin(formData: FormData): Promise<{ ok?: boolean; error?: string }> {
  if (!(await currentUserIsSuperAdmin())) return NOT_AUTHORIZED
  const userId = formData.get('id') as string
  if (!userId) return { error: 'ID em falta.' }

  // Não deixar eliminar a si próprio
  const supabase = await createClient()
  const { data: { user: current } } = await supabase.auth.getUser()
  if (current?.id === userId) {
    return { error: 'Não podes eliminar a tua própria conta.' }
  }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }

  await (supabase.from('activity_log') as any).insert({
    action: 'ELIMINAR_ADMIN',
    description: `Eliminou administrador (id ${userId.slice(0, 8)}…)`,
    entity_type: 'admin',
    entity_id: userId,
  })

  revalidatePath('/dashboard/admins')
  return { ok: true }
}

// Repor password — Supabase não permite ler password, mas dá para
// "set new" via Admin API. Útil quando alguém perde acesso.
export async function reporPassword(formData: FormData): Promise<{ ok?: boolean; error?: string }> {
  if (!(await currentUserIsSuperAdmin())) return NOT_AUTHORIZED
  const userId = formData.get('id') as string
  const newPassword = formData.get('password') as string
  if (!userId || !newPassword) return { error: 'Parâmetros em falta.' }
  if (newPassword.length < 8) return { error: 'Password tem de ter pelo menos 8 caracteres.' }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.updateUserById(userId, { password: newPassword })
  if (error) return { error: error.message }

  const supabase = await createClient()
  await (supabase.from('activity_log') as any).insert({
    action: 'EDITAR_ADMIN',
    description: `Repôs password de administrador (id ${userId.slice(0, 8)}…)`,
    entity_type: 'admin',
    entity_id: userId,
  })

  revalidatePath('/dashboard/admins')
  return { ok: true }
}
