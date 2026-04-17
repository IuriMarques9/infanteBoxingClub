'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ─── CRIAR EVENTO ───────────────────────────────────────────────
export async function criarEvento(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const location = formData.get('location') as string
  const imageurl = formData.get('imageurl') as string

  const { data, error } = await (supabase.from('eventos') as any).insert({
    title,
    description,
    date,
    location,
    imageurl: imageurl || null,
  }).select('id').single()

  if (error) {
    console.error('Erro ao criar evento:', error.message)
    redirect('/dashboard/eventos?error=create_failed')
  }

  // Registar no log de atividades
  await (supabase.from('activity_log') as any).insert({
    action: 'CRIAR_EVENTO',
    description: `Criou o evento: "${title}" para o dia ${new Date(date).toLocaleDateString()}`,
    entity_type: 'evento',
    entity_id: data.id,
  })

  revalidatePath('/dashboard/eventos')
  revalidatePath('/#events')
  redirect('/dashboard/eventos')
}

// ─── EDITAR EVENTO ──────────────────────────────────────────────
export async function editarEvento(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const location = formData.get('location') as string
  const imageurl = formData.get('imageurl') as string

  const { error } = await (supabase.from('eventos') as any)
    .update({
      title,
      description,
      date,
      location,
      imageurl: imageurl || null,
    })
    .eq('id', id)

  if (error) {
    console.error('Erro ao editar evento:', error.message)
    redirect(`/dashboard/eventos?error=update_failed`)
  }

  await (supabase.from('activity_log') as any).insert({
    action: 'EDITAR_EVENTO',
    description: `Editou o evento: "${title}"`,
    entity_type: 'evento',
    entity_id: id,
  })

  revalidatePath('/dashboard/eventos')
  revalidatePath('/#events')
  redirect('/dashboard/eventos')
}

// ─── ELIMINAR EVENTO ────────────────────────────────────────────
export async function eliminarEvento(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { data: ev } = await (supabase.from('eventos').select('title').eq('id', id).single() as any)

  const { error } = await (supabase.from('eventos').delete().eq('id', id) as any)

  if (error) {
    console.error('Erro ao eliminar evento:', error.message)
    redirect('/dashboard/eventos?error=delete_failed')
  }

  await (supabase.from('activity_log') as any).insert({
    action: 'ELIMINAR_EVENTO',
    description: `Eliminou o evento: "${ev?.title || 'Desconhecido'}"`,
    entity_type: 'evento',
    entity_id: id,
  })

  revalidatePath('/dashboard/eventos')
  revalidatePath('/#events')
  redirect('/dashboard/eventos')
}
