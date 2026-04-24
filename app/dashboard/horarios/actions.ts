'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { buildDescricao, buildHora, WEEKDAYS, type WeekDay } from '@/lib/horarios'

async function logAction(supabase: any, action: string, description: string, entityId?: string) {
  await (supabase.from('activity_log') as any).insert({
    action,
    description,
    entity_type: 'horario',
    entity_id: entityId || null,
  })
}

function pad2(v: string | null) {
  if (!v) return null
  return v.padStart(2, '0')
}

function combine(h: string | null, m: string | null): string | null {
  const hh = pad2(h)
  const mm = pad2(m)
  if (!hh || !mm) return null
  return `${hh}:${mm}`
}

function parseStructured(formData: FormData) {
  const diasRaw = formData.getAll('dias_semana') as string[]
  const dias = diasRaw.filter((d): d is WeekDay => (WEEKDAYS as readonly string[]).includes(d))
  const horaInicio = combine(
    formData.get('hora_inicio_h') as string | null,
    formData.get('hora_inicio_m') as string | null,
  )
  const horaFim = combine(
    formData.get('hora_fim_h') as string | null,
    formData.get('hora_fim_m') as string | null,
  )
  const structuredComplete = dias.length > 0 && !!horaInicio && !!horaFim
  return { dias, horaInicio, horaFim, structuredComplete }
}

export async function criarHorario(formData: FormData) {
  const supabase = await createClient()

  const turma = formData.get('turma') as string
  const { dias, horaInicio, horaFim, structuredComplete } = parseStructured(formData)

  if (!structuredComplete) {
    redirect('/dashboard/horarios?error=missing_fields')
  }

  const descricao = buildDescricao(dias, 'pt')
  const hora = buildHora(horaInicio as string, horaFim as string, 'pt')

  const { data, error } = await (supabase.from('horarios') as any).insert({
    turma,
    descricao,
    hora,
    dias_semana: dias,
    hora_inicio: horaInicio,
    hora_fim: horaFim,
  }).select('id').single()

  if (error) {
    console.error('Erro ao criar horário:', error.message)
    redirect(`/dashboard/horarios?error=create_failed&detail=${encodeURIComponent(error.message)}`)
  }

  await logAction(supabase, 'CRIAR_HORARIO', `Adicionou "${descricao} · ${hora}" à turma ${turma}`, data.id)

  revalidatePath('/dashboard/horarios')
  revalidatePath('/')
  redirect('/dashboard/horarios')
}

export async function editarHorario(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const { dias, horaInicio, horaFim, structuredComplete } = parseStructured(formData)

  if (!structuredComplete) {
    redirect('/dashboard/horarios?error=missing_fields')
  }

  const descricao = buildDescricao(dias, 'pt')
  const hora = buildHora(horaInicio as string, horaFim as string, 'pt')

  const { error } = await (supabase.from('horarios') as any)
    .update({
      descricao,
      hora,
      dias_semana: dias,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
    })
    .eq('id', id)

  if (error) {
    console.error('Erro ao editar horário:', error.message)
    redirect(`/dashboard/horarios?error=update_failed&detail=${encodeURIComponent(error.message)}`)
  }

  await logAction(supabase, 'EDITAR_HORARIO', `Editou horário para "${descricao} · ${hora}"`, id)

  revalidatePath('/dashboard/horarios')
  revalidatePath('/')
  redirect('/dashboard/horarios')
}

export async function removerDiaHorario(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const dia = formData.get('dia') as string

  if (!id || !dia || !(WEEKDAYS as readonly string[]).includes(dia)) {
    redirect('/dashboard/horarios?error=update_failed')
  }

  const { data: h, error: fetchErr } = await (supabase
    .from('horarios')
    .select('turma, dias_semana, hora_inicio, hora_fim, hora')
    .eq('id', id)
    .single() as any)

  if (fetchErr || !h) {
    redirect('/dashboard/horarios?error=update_failed')
  }

  const diasAtuais: string[] = Array.isArray(h.dias_semana) ? h.dias_semana : []
  const diasRestantes = diasAtuais.filter((d) => d !== dia) as WeekDay[]

  if (diasRestantes.length === 0) {
    const { error } = await (supabase.from('horarios').delete().eq('id', id) as any)
    if (error) {
      console.error('Erro ao eliminar horário:', error.message)
      redirect(`/dashboard/horarios?error=update_failed&detail=${encodeURIComponent(error.message)}`)
    }
    await logAction(
      supabase,
      'ELIMINAR_HORARIO',
      `Removeu último dia (${dia}) e eliminou horário da turma ${h.turma}`,
      id,
    )
  } else {
    const descricao = buildDescricao(diasRestantes, 'pt')
    const { error } = await (supabase.from('horarios') as any)
      .update({ dias_semana: diasRestantes, descricao })
      .eq('id', id)
    if (error) {
      console.error('Erro ao atualizar horário:', error.message)
      redirect(`/dashboard/horarios?error=update_failed&detail=${encodeURIComponent(error.message)}`)
    }
    await logAction(
      supabase,
      'EDITAR_HORARIO',
      `Removeu ${dia} do horário "${h.hora || '?'}" da turma ${h.turma}`,
      id,
    )
  }

  revalidatePath('/dashboard/horarios')
  revalidatePath('/')
  redirect('/dashboard/horarios')
}

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
  revalidatePath('/')
  redirect('/dashboard/horarios')
}
