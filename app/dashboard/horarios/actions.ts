'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function logAction(supabase: any, action: string, description: string, entityId?: string) {
  await (supabase.from('activity_log') as any).insert({
    action,
    description,
    entity_type: 'horario',
    entity_id: entityId || null,
  })
}

// ─── CRIAR HORÁRIO ──────────────────────────────────────────────
export async function criarHorario(formData: FormData) {
  const supabase = await createClient()

  const turma = formData.get('turma') as string
  const descricao = formData.get('descricao') as string
  const hora = formData.get('hora') as string

  const { data, error } = await (supabase.from('horarios') as any).insert({
    turma,
    descricao,
    hora,
  }).select('id').single()

  if (error) {
    console.error('Erro ao criar horário:', error.message)
    redirect('/dashboard/horarios?error=create_failed')
  }

  await logAction(supabase, 'CRIAR_HORARIO', `Adicionou horário "${descricao} · ${hora}" à turma ${turma}`, data.id)

  revalidatePath('/dashboard/horarios')
  revalidatePath('/#schedule')
  redirect('/dashboard/horarios')
}

// ─── EDITAR HORÁRIO ─────────────────────────────────────────────
export async function editarHorario(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const descricao = formData.get('descricao') as string
  const hora = formData.get('hora') as string

  const { error } = await (supabase.from('horarios') as any)
    .update({ descricao, hora })
    .eq('id', id)

  if (error) {
    console.error('Erro ao editar horário:', error.message)
    redirect('/dashboard/horarios?error=update_failed')
  }

  await logAction(supabase, 'EDITAR_HORARIO', `Editou horário para "${descricao} · ${hora}"`, id)

  revalidatePath('/dashboard/horarios')
  revalidatePath('/#schedule')
  redirect('/dashboard/horarios')
}

// ─── ELIMINAR HORÁRIO ───────────────────────────────────────────
export async function eliminarHorario(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { data: h } = await (supabase.from('horarios').select('descricao, hora, turma').eq('id', id).single() as any)

  const { error } = await (supabase.from('horarios').delete().eq('id', id) as any)

  if (error) {
    console.error('Erro ao eliminar horário:', error.message)
  }

  await logAction(
    supabase,
    'ELIMINAR_HORARIO',
    `Eliminou horário "${h?.descricao || '?'} · ${h?.hora || '?'}" da turma ${h?.turma || '?'}`,
    id
  )

  revalidatePath('/dashboard/horarios')
  revalidatePath('/#schedule')
  redirect('/dashboard/horarios')
}
