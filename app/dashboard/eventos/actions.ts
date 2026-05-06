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
  const date_end = formData.get('date_end') as string
  const location = formData.get('location') as string
  const imageurl = formData.get('imageurl') as string
  const cta_url = formData.get('cta_url') as string
  const all_day = formData.getAll('all_day').includes('on')

  const { data, error } = await (supabase.from('eventos') as any).insert({
    title,
    description,
    date,
    date_end: date_end || null,
    all_day,
    location,
    imageurl: imageurl || null,
    cta_url: cta_url || null,
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
  revalidatePath('/')
  redirect('/dashboard/eventos')
}

// ─── EDITAR EVENTO ──────────────────────────────────────────────
export async function editarEvento(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const date_end = formData.get('date_end') as string
  const location = formData.get('location') as string
  const imageurl = formData.get('imageurl') as string
  const imageurl_previous = formData.get('imageurl_previous') as string
  const cta_url = formData.get('cta_url') as string
  const all_day = formData.getAll('all_day').includes('on')

  const { error } = await (supabase.from('eventos') as any)
    .update({
      title,
      description,
      date,
      date_end: date_end || null,
      all_day,
      location,
      imageurl: imageurl || null,
      cta_url: cta_url || null,
    })
    .eq('id', id)

  if (error) {
    console.error('Erro ao editar evento:', error.message)
    redirect(`/dashboard/eventos?error=update_failed`)
  }

  // Limpar imagem anterior do Storage se mudou
  if (imageurl_previous && imageurl_previous !== (imageurl || null)) {
    try {
      const url = new URL(imageurl_previous)
      const storagePath = url.pathname.split('/storage/v1/object/public/images/')[1]
      if (storagePath) {
        await supabase.storage.from('images').remove([decodeURIComponent(storagePath)])
      }
    } catch {}
  }

  await (supabase.from('activity_log') as any).insert({
    action: 'EDITAR_EVENTO',
    description: `Editou o evento: "${title}"`,
    entity_type: 'evento',
    entity_id: id,
  })

  revalidatePath('/dashboard/eventos')
  revalidatePath('/')
  redirect('/dashboard/eventos')
}

// ─── ELIMINAR EVENTO ────────────────────────────────────────────
export async function eliminarEvento(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { data: ev } = await (supabase.from('eventos').select('title, imageurl').eq('id', id).single() as any)

  const { error } = await (supabase.from('eventos').delete().eq('id', id) as any)

  if (error) {
    console.error('Erro ao eliminar evento:', error.message)
    redirect('/dashboard/eventos?error=delete_failed')
  }

  // Limpar imagem do Storage
  if (ev?.imageurl) {
    try {
      const url = new URL(ev.imageurl)
      const storagePath = url.pathname.split('/storage/v1/object/public/images/')[1]
      if (storagePath) {
        await supabase.storage.from('images').remove([decodeURIComponent(storagePath)])
      }
    } catch {}
  }

  await (supabase.from('activity_log') as any).insert({
    action: 'ELIMINAR_EVENTO',
    description: `Eliminou o evento: "${ev?.title || 'Desconhecido'}"`,
    entity_type: 'evento',
    entity_id: id,
  })

  revalidatePath('/dashboard/eventos')
  revalidatePath('/')
  redirect('/dashboard/eventos')
}
