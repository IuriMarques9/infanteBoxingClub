'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type LoginState = {
  error?: 'Invalid Credentials' | 'unknown'
  email?: string
  password?: string
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const supabase = await createClient()

  const email = (formData.get('email') as string) ?? ''
  const password = (formData.get('password') as string) ?? ''

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Invalid Credentials', email, password }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
