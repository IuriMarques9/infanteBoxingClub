import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export const createClient = async () => {
  // Ajuste para o Next.js 15: cookies() é assíncrono
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as CookieOptions)
            )
          } catch {
            // O `setAll` pode ser chamado a partir de um Server Component.
            // Isto pode ser ignorado se tiveres o middleware a refrescar 
            // as sessões do utilizador.
          }
        },
      },
    }
  )
}