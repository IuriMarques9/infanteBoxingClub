import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

// ─── CLIENTE ADMIN (SERVICE ROLE) ──────────────────────────────
// Usa o SUPABASE_SERVICE_ROLE_KEY (privado) para operações que
// requerem privilégios elevados — listar utilizadores auth, criar/
// eliminar contas. NUNCA importar para client components.
//
// Atira em build se a key não estiver definida; o caller deve
// validar ENV antes ou tratar o erro em runtime.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_URL em falta no .env')
  }
  return createSupabaseClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
