'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function salvarFicha(formData: FormData) {
  const supabase = await createClient()
  const membro_id = formData.get('membro_id') as string

  const payload = {
    membro_id,
    cc_numero: (formData.get('cc_numero') as string) || null,
    nif: (formData.get('nif') as string) || null,
    nacionalidade: (formData.get('nacionalidade') as string) || null,
    morada: (formData.get('morada') as string) || null,

    emergencia_nome: (formData.get('emergencia_nome') as string) || null,
    emergencia_parentesco: (formData.get('emergencia_parentesco') as string) || null,
    emergencia_data_nascimento: (formData.get('emergencia_data_nascimento') as string) || null,
    emergencia_cc: (formData.get('emergencia_cc') as string) || null,
    emergencia_nif: (formData.get('emergencia_nif') as string) || null,
    emergencia_nacionalidade: (formData.get('emergencia_nacionalidade') as string) || null,
    emergencia_morada: (formData.get('emergencia_morada') as string) || null,
    emergencia_telefone: (formData.get('emergencia_telefone') as string) || null,

    doencas: (formData.get('doencas') as string) || null,
    medicacao: (formData.get('medicacao') as string) || null,
    saude_observacoes: (formData.get('saude_observacoes') as string) || null,

    objetivo: (formData.get('objetivo') as string) || null,

    updated_at: new Date().toISOString(),
  }

  const { error } = await (supabase.from('fichas_cliente') as any)
    .upsert(payload, { onConflict: 'membro_id' })

  if (error) {
    console.error('Erro ao guardar ficha:', error.message)
    redirect(`/dashboard/membros/${membro_id}?error=ficha_failed&detail=${encodeURIComponent(error.message)}`)
  }

  await (supabase.from('activity_log') as any).insert({
    action: 'ATUALIZAR_FICHA',
    description: `Atualizou a ficha de cliente`,
    entity_type: 'membro',
    entity_id: membro_id,
  })

  revalidatePath(`/dashboard/membros/${membro_id}`)
  redirect(`/dashboard/membros/${membro_id}`)
}
