'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Converte form data para email / password
  const formValues = Object.fromEntries(formData.entries())
  const email = formValues.email as string
  const password = formValues.password as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?error=Invalid%20Credentials')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
