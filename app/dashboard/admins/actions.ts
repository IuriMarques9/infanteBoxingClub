'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { currentUserIsSuperAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { AdminInviteEmail } from '@/components/templates/admin-invite-email'
import { PasswordResetEmail } from '@/components/templates/password-reset-email'

const NOT_AUTHORIZED = { error: 'Apenas o administrador principal pode gerir contas de admin.' }

// ─── GESTÃO DE ADMINISTRADORES ──────────────────────────────────
// Cria/lista/elimina contas que conseguem entrar na dashboard.
// Usa o SUPABASE_SERVICE_ROLE_KEY (cliente admin) para listar e
// criar utilizadores em `auth.users`. A trigger `on_auth_user_created`
// (em schema.sql) popula automaticamente a tabela `profiles`.

export interface AdminRow {
  id: string
  email: string
  nome: string | null
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
    .select('id, email, role, nome') as any)

  const profMap = new Map<string, any>((profiles || []).map((p: any) => [p.id, p]))

  return authUsers.map(u => ({
    id: u.id,
    email: u.email || '(sem email)',
    nome: profMap.get(u.id)?.nome ?? null,
    role: profMap.get(u.id)?.role ?? 'admin',
    last_sign_in_at: u.last_sign_in_at ?? null,
    created_at: u.created_at,
  })).sort((a, b) => a.email.localeCompare(b.email))
}

// Cria uma nova conta de admin SEM password e envia email de convite
// com link único (Supabase invite) para a pessoa definir a sua password.
// O email é enviado via Resend usando template com cores do clube.
export async function criarAdmin(formData: FormData): Promise<{ ok?: boolean; error?: string }> {
  if (!(await currentUserIsSuperAdmin())) return NOT_AUTHORIZED
  const email = (formData.get('email') as string || '').trim().toLowerCase()

  if (!email) return { error: 'Email obrigatório.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Email inválido.' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const admin = createAdminClient()

  // 1. Gerar link de invite — cria utilizador SEM password se ainda não existir.
  //    O link contém access_token + refresh_token no fragmento (#) e
  //    redireciona para /auth/set-password.
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'invite',
    email,
    options: { redirectTo: `${siteUrl}/auth/set-password` },
  })
  if (linkError) return { error: linkError.message }

  const inviteUrl = linkData?.properties?.action_link
  const newUserId = linkData?.user?.id
  if (!inviteUrl) return { error: 'Não foi possível gerar o link de convite.' }

  // 2. Buscar email do super admin (para mostrar no template)
  const supabase = await createClient()
  const { data: { user: inviter } } = await supabase.auth.getUser()

  // 3. Enviar email via Resend
  if (!process.env.RESEND_API_KEY) {
    return { error: 'RESEND_API_KEY não configurada — não foi possível enviar email.' }
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  const html = await render(
    AdminInviteEmail({ inviteUrl, inviterEmail: inviter?.email || undefined })
  )

  const { error: sendError } = await resend.emails.send({
    from: 'Infante Boxing Club <noreply@associacaoinfante.pt>',
    to: email,
    subject: 'Convite para administrar o Infante Boxing Club',
    html,
  })
  if (sendError) {
    // Conta já foi criada via generateLink — devolve erro mas mantém estado.
    return { error: `Conta criada mas falhou envio do email: ${sendError.message}` }
  }

  // 4. Log da ação
  await (supabase.from('activity_log') as any).insert({
    action: 'CRIAR_ADMIN',
    description: `Convidou administrador "${email}"`,
    entity_type: 'admin',
    entity_id: newUserId,
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

  // Defensivo: caso a migration `20260427_profiles_cascade_delete.sql`
  // ainda não esteja aplicada, a FK profiles → auth.users sem CASCADE
  // bloqueia a eliminação. Apagamos a linha em `profiles` via service
  // role primeiro (bypassa RLS), depois eliminamos do auth. Quando
  // a migration estiver aplicada este passo torna-se redundante mas
  // inofensivo (a linha já não existe quando o auth.users for apagado).
  await admin.from('profiles').delete().eq('id', userId)

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

// Repor password — gera link de recovery do Supabase e envia email para
// o admin em causa. O super-admin nunca toca na password (mais seguro
// que definir uma manualmente e ter de comunicá-la noutro canal).
export async function reporPassword(formData: FormData): Promise<{ ok?: boolean; error?: string }> {
  if (!(await currentUserIsSuperAdmin())) return NOT_AUTHORIZED
  const userId = formData.get('id') as string
  if (!userId) return { error: 'ID em falta.' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const admin = createAdminClient()

  // 1. Buscar email do admin alvo (vem do auth.users via Admin API).
  const { data: targetUser, error: getUserError } = await admin.auth.admin.getUserById(userId)
  if (getUserError || !targetUser?.user?.email) {
    return { error: 'Não foi possível encontrar o email deste administrador.' }
  }
  const targetEmail = targetUser.user.email

  // 2. Gerar link de recovery (mesma flow do /auth/forgot-password).
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email: targetEmail,
    options: { redirectTo: `${siteUrl}/auth/set-password` },
  })
  if (linkError || !linkData?.properties?.action_link) {
    return { error: linkError?.message || 'Não foi possível gerar o link de recuperação.' }
  }
  const resetUrl = linkData.properties.action_link

  // 3. Enviar email via Resend com o template já existente.
  if (!process.env.RESEND_API_KEY) {
    return { error: 'RESEND_API_KEY não configurada — não foi possível enviar email.' }
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  const html = await render(PasswordResetEmail({ resetUrl }))

  const { error: sendError } = await resend.emails.send({
    from: 'Infante Boxing Club <noreply@associacaoinfante.pt>',
    to: targetEmail,
    subject: 'Recuperar password — Infante Boxing Club',
    html,
  })
  if (sendError) {
    return { error: `Falhou envio do email: ${sendError.message}` }
  }

  // 4. Log da ação.
  const supabase = await createClient()
  await (supabase.from('activity_log') as any).insert({
    action: 'EDITAR_ADMIN',
    description: `Enviou email de reposição de password para "${targetEmail}"`,
    entity_type: 'admin',
    entity_id: userId,
  })

  revalidatePath('/dashboard/admins')
  return { ok: true }
}

// Actualizar nome de apresentação de um admin.
// O nome aparece na coluna "Admin" do histórico de atividade.
export async function atualizarNomeAdmin(formData: FormData): Promise<{ ok?: boolean; error?: string }> {
  if (!(await currentUserIsSuperAdmin())) return NOT_AUTHORIZED
  const userId = formData.get('id') as string
  const nome = ((formData.get('nome') as string) || '').trim()
  if (!userId) return { error: 'ID em falta.' }

  // Usa service role para bypassar RLS — profiles só tem política SELECT
  // para authenticated; UPDATE silencioso (0 rows, sem error) com anon key.
  const admin = createAdminClient()
  const { error } = await (admin
    .from('profiles')
    .update({ nome: nome || null })
    .eq('id', userId) as any)
  if (error) return { error: error.message }

  revalidatePath('/dashboard/admins')
  revalidatePath('/dashboard/logs')
  return { ok: true }
}
