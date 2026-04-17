'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ─── CRIAR/ATUALIZAR HORÁRIO ────────────────────────────────────
// Permite ao administrador definir os horários de treino
// por turma. Estes dados são depois apresentados publicamente
// na Landing Page na secção de horários.
export async function criarHorario(formData: FormData) {
  const supabase = await createClient()


  const turma = formData.get('turma') as string
  const descricao = formData.get('descricao') as string
  const hora = formData.get('hora') as string

  const { error } = await (supabase.from('horarios') as any).insert({
    turma,
    descricao,
    hora,
  })

  if (error) {
    console.error('Erro ao criar horário:', error.message)
    redirect('/dashboard/horarios?error=create_failed')
  }

  revalidatePath('/dashboard/horarios')
  redirect('/dashboard/horarios')
}

// ─── ELIMINAR HORÁRIO ───────────────────────────────────────────
export async function eliminarHorario(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { error } = await (supabase.from('horarios').delete().eq('id', id) as any)

  if (error) {
    console.error('Erro ao eliminar horário:', error.message)
  }

  revalidatePath('/dashboard/horarios')
  redirect('/dashboard/horarios')
}
