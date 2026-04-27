'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { buildDescricao, buildHora, WEEKDAYS, type WeekDay } from '@/lib/horarios'

// ─── DETEÇÃO DE CONFLITOS (C1) ─────────────────────────────────
// Verifica se um novo/editado horário se sobrepõe a outro EXISTENTE
// na mesma turma e em pelo menos um dia comum.
// Retorna o ID do horário em conflito, ou null se livre.
async function detetarConflito(
  supabase: any,
  turma: string,
  dias: WeekDay[],
  horaInicio: string,
  horaFim: string,
  excluirId?: string,
): Promise<{ conflitoId: string; descricao: string } | null> {
  let q: any = supabase
    .from('horarios')
    .select('id, descricao, hora, dias_semana, hora_inicio, hora_fim')
    .eq('turma', turma)
  if (excluirId) q = q.neq('id', excluirId)
  const { data } = await q

  for (const h of (data || [])) {
    const outrosDias: string[] = Array.isArray(h.dias_semana) ? h.dias_semana : []
    const partilham = outrosDias.some(d => dias.includes(d as WeekDay))
    if (!partilham) continue
    if (!h.hora_inicio || !h.hora_fim) continue
    // Sobreposição: A.inicio < B.fim && B.inicio < A.fim
    if (horaInicio < h.hora_fim && h.hora_inicio < horaFim) {
      return { conflitoId: h.id, descricao: `${h.descricao || '?'} · ${h.hora || '?'}` }
    }
  }
  return null
}

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

  // Bloqueio de conflito (C1) — só dentro da MESMA turma; turmas
  // diferentes podem coexistir no mesmo dia/hora.
  const conflito = await detetarConflito(supabase, turma, dias, horaInicio as string, horaFim as string)
  if (conflito) {
    redirect(`/dashboard/horarios?error=conflict&detail=${encodeURIComponent(conflito.descricao)}`)
  }

  const descricao = buildDescricao(dias, 'pt')
  const hora = buildHora(horaInicio as string, horaFim as string, 'pt')

  const payload: any = {
    turma,
    descricao,
    hora,
    dias_semana: dias,
    hora_inicio: horaInicio,
    hora_fim: horaFim,
  }

  const { data, error } = await (supabase.from('horarios') as any).insert(payload).select('id').single()

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

  // Bloqueio de conflito ao editar (C1)
  const { data: existing } = await (supabase
    .from('horarios')
    .select('turma')
    .eq('id', id)
    .single() as any)
  if (existing?.turma) {
    const conflito = await detetarConflito(
      supabase,
      existing.turma,
      dias,
      horaInicio as string,
      horaFim as string,
      id,
    )
    if (conflito) {
      redirect(`/dashboard/horarios?error=conflict&detail=${encodeURIComponent(conflito.descricao)}`)
    }
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

// ─── DUPLICAR DIA EM HORÁRIO EXISTENTE (C2) ───────────────────
// Acrescenta um dia adicional a um horário (mesma turma, mesmas
// horas, dia diferente). Útil para "copiar Terça → Quinta".
export async function duplicarDiaHorario(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const novoDia = formData.get('novo_dia') as string

  if (!id || !novoDia || !(WEEKDAYS as readonly string[]).includes(novoDia)) {
    redirect('/dashboard/horarios?error=update_failed')
  }

  const { data: h } = await (supabase
    .from('horarios')
    .select('turma, dias_semana, hora_inicio, hora_fim')
    .eq('id', id)
    .single() as any)

  if (!h || !h.hora_inicio || !h.hora_fim) {
    redirect('/dashboard/horarios?error=update_failed')
  }

  const dias: WeekDay[] = Array.isArray(h.dias_semana) ? (h.dias_semana as WeekDay[]) : []
  if (dias.includes(novoDia as WeekDay)) {
    // Já contém esse dia — nada a fazer
    redirect('/dashboard/horarios')
  }

  // Conflito noutro horário da mesma turma para esse dia/hora?
  const conflito = await detetarConflito(
    supabase,
    h.turma,
    [novoDia as WeekDay],
    h.hora_inicio,
    h.hora_fim,
    id,
  )
  if (conflito) {
    redirect(`/dashboard/horarios?error=conflict&detail=${encodeURIComponent(conflito.descricao)}`)
  }

  const novosDias: WeekDay[] = [...dias, novoDia as WeekDay]
  const novaDescricao = buildDescricao(novosDias, 'pt')

  const { error } = await (supabase.from('horarios') as any)
    .update({ dias_semana: novosDias, descricao: novaDescricao })
    .eq('id', id)

  if (error) {
    redirect(`/dashboard/horarios?error=update_failed&detail=${encodeURIComponent(error.message)}`)
  }

  await logAction(
    supabase,
    'EDITAR_HORARIO',
    `Adicionou ${novoDia} ao horário "${h.hora_inicio}-${h.hora_fim}" da turma ${h.turma}`,
    id,
  )

  revalidatePath('/dashboard/horarios')
  revalidatePath('/')
  redirect('/dashboard/horarios')
}

// ─── MIGRAÇÃO ASSISTIDA DE HORÁRIOS LEGACY (C4) ────────────────
// Para registos sem `dias_semana` ou `hora_inicio` mas com `hora`
// no formato "HH:MM às HH:MM" e `descricao` com nomes de dias,
// extrai os campos estruturados e atualiza.
const DIA_KEYWORDS: Record<string, WeekDay> = {
  'segunda': 'mon', 'segundas': 'mon', 'mon': 'mon',
  'terça':   'tue', 'terças':   'tue', 'terca': 'tue', 'tue': 'tue',
  'quarta':  'wed', 'quartas':  'wed', 'wed': 'wed',
  'quinta':  'thu', 'quintas':  'thu', 'thu': 'thu',
  'sexta':   'fri', 'sextas':   'fri', 'fri': 'fri',
  'sábado':  'sat', 'sabado':   'sat', 'sat': 'sat',
  'domingo': 'sun', 'sun': 'sun',
}

function parseLegacy(descricao: string | null, hora: string | null): { dias: WeekDay[]; horaInicio: string | null; horaFim: string | null } {
  const dias: WeekDay[] = []
  if (descricao) {
    const lower = descricao.toLowerCase()
    for (const [kw, dia] of Object.entries(DIA_KEYWORDS)) {
      if (lower.includes(kw) && !dias.includes(dia)) dias.push(dia)
    }
  }
  let horaInicio: string | null = null
  let horaFim: string | null = null
  if (hora) {
    const m = hora.match(/(\d{1,2}):(\d{2})\s*[a-záé\-–—]+\s*(\d{1,2}):(\d{2})/i)
    if (m) {
      horaInicio = `${m[1].padStart(2, '0')}:${m[2]}`
      horaFim    = `${m[3].padStart(2, '0')}:${m[4]}`
    }
  }
  return { dias, horaInicio, horaFim }
}

export async function migrarHorarioLegacy(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  if (!id) redirect('/dashboard/horarios?error=update_failed')

  const { data: h } = await (supabase
    .from('horarios')
    .select('descricao, hora, dias_semana, hora_inicio, turma')
    .eq('id', id)
    .single() as any)

  if (!h) redirect('/dashboard/horarios?error=update_failed')

  const { dias, horaInicio, horaFim } = parseLegacy(h.descricao, h.hora)

  if (dias.length === 0 || !horaInicio || !horaFim) {
    redirect('/dashboard/horarios?error=migrate_failed&detail=' +
      encodeURIComponent('Não consegui extrair dias e horas. Edita manualmente.'))
  }

  const novaDescricao = buildDescricao(dias, 'pt')
  const novaHora = buildHora(horaInicio, horaFim, 'pt')

  const { error } = await (supabase.from('horarios') as any)
    .update({
      dias_semana: dias,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      descricao: novaDescricao,
      hora: novaHora,
    })
    .eq('id', id)

  if (error) {
    redirect(`/dashboard/horarios?error=update_failed&detail=${encodeURIComponent(error.message)}`)
  }

  await logAction(supabase, 'EDITAR_HORARIO', `Migrou horário legacy "${h.hora}" → ${novaDescricao} ${novaHora}`, id)

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
