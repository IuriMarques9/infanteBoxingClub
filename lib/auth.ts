import { createClient } from './supabase/server'

// ─── HIERARQUIA DE ADMINS ──────────────────────────────────────
// Existe um único "super admin" — a conta principal — definida pela
// variável de ambiente `SUPER_ADMIN_EMAIL` (server-only, não exposta
// ao cliente). Esta conta é a única que pode aceder à página
// /dashboard/admins (criar/eliminar admins, repor passwords).
//
// Os outros admins continuam autenticados como qualquer outro
// utilizador e podem usar TODAS as restantes funcionalidades —
// gerir membros, pagamentos, horários, documentos, etc.
//
// Vantagens desta abordagem (vs. coluna `role` na BD):
//   • Não precisa de migration nem de RLS extra
//   • Definir/mudar o super admin é só editar a env var
//   • Falha "fechado" se a env var faltar (ninguém é super admin)

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase()

export function emailIsSuperAdmin(email: string | null | undefined): boolean {
  if (!SUPER_ADMIN_EMAIL || !email) return false
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL
}

// Server-side: lê o user actual do Supabase e verifica.
// Retorna `false` se a env var não estiver configurada — nada
// fica acessível por engano.
export async function currentUserIsSuperAdmin(): Promise<boolean> {
  if (!SUPER_ADMIN_EMAIL) return false
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return emailIsSuperAdmin(user?.email)
}
