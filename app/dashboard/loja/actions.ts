'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ─── CRIAR PRODUTO ──────────────────────────────────────────────
export async function criarProduto(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const imageurl = formData.get('imageurl') as string
  const in_stock = formData.get('in_stock') === 'on'

  const { data, error } = await (supabase.from('store_products') as any).insert({
    name,
    description: description || null,
    price,
    imageUrl: imageurl || null,
    in_stock,
  }).select('id').single()

  if (error) {
    console.error('Erro ao criar produto:', error.message)
    redirect('/dashboard/loja?error=create_failed')
  }

  // Auditoria
  await (supabase.from('activity_log') as any).insert({
    action: 'CRIAR_PRODUTO',
    description: `Adicionou o produto "${name}" à loja por ${price}€`,
    entity_type: 'produto',
    entity_id: data.id,
  })

  revalidatePath('/dashboard/loja')
  revalidatePath('/#merch')
  redirect('/dashboard/loja')
}

// ─── EDITAR PRODUTO ─────────────────────────────────────────────
export async function editarProduto(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const imageurl = formData.get('imageurl') as string
  const in_stock = formData.get('in_stock') === 'on'

  const { error } = await (supabase.from('store_products') as any)
    .update({
      name,
      description: description || null,
      price,
      imageUrl: imageurl || null,
      in_stock,
    })
    .eq('id', id)

  if (error) {
    console.error('Erro ao editar produto:', error.message)
    redirect(`/dashboard/loja?error=update_failed`)
  }

  await (supabase.from('activity_log') as any).insert({
    action: 'EDITAR_PRODUTO',
    description: `Editou o produto "${name}"`,
    entity_type: 'produto',
    entity_id: id,
  })

  revalidatePath('/dashboard/loja')
  revalidatePath('/#merch')
  redirect('/dashboard/loja')
}

// ─── ELIMINAR PRODUTO ───────────────────────────────────────────
export async function eliminarProduto(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { data: prod } = await (supabase.from('store_products').select('name').eq('id', id).single() as any)

  const { error } = await (supabase.from('store_products').delete().eq('id', id) as any)

  if (error) {
    console.error('Erro ao eliminar produto:', error.message)
    redirect('/dashboard/loja?error=delete_failed')
  }

  await (supabase.from('activity_log') as any).insert({
    action: 'ELIMINAR_PRODUTO',
    description: `Removeu o produto "${prod?.name || 'Desconhecido'}" da loja`,
    entity_type: 'produto',
    entity_id: id,
  })

  revalidatePath('/dashboard/loja')
  revalidatePath('/#merch')
  redirect('/dashboard/loja')
}
