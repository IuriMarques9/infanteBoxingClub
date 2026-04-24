'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { Turma, TURMA_LABELS, StatusMembro, STATUS_CONFIG } from './constants'
import { anoAtual } from '@/lib/membros-estado'

// ─── CALCULAR ESTADO ────────────────────────────────────────────
// Função reutilizável para calcular o estado de um membro com base
// nos seus pagamentos e na flag de isenção.
export async function calcularEstado(membro: any): Promise<StatusMembro> {
  // Se está isento, retorna imediatamente
  if (membro.is_isento) return 'isento'

  const pagamentos = membro.pagamentos || []
  const agora = new Date()
  const mesAtual = agora.toISOString().slice(0, 7)  // "2026-04"

  // Calcular o mês anterior
  const mesAnteriorDate = new Date(agora.getFullYear(), agora.getMonth() - 1, 1)
  const mesAnterior = mesAnteriorDate.toISOString().slice(0, 7)

  const pagouEsteMes = pagamentos.some((p: any) => p.mes_referencia === mesAtual)
  const pagouMesPassado = pagamentos.some((p: any) => p.mes_referencia === mesAnterior)

  if (pagouEsteMes) return 'pago'
  if (!pagouMesPassado) return 'inativo'
  return 'nao_pago'
}

// ─── REGISTAR AÇÃO NO LOG ───────────────────────────────────────
// Função auxiliar que grava no activity_log cada operação realizada.
// O admin_id é preenchido automaticamente pelo Supabase (auth.uid()).
async function logAction(
  supabase: any,
  action: string,
  description: string,
  entityType: string,
  entityId?: string
) {
  await (supabase.from('activity_log') as any).insert({
    action,
    description,
    entity_type: entityType,
    entity_id: entityId || null,
  })
}

// ─── CRIAR MEMBRO ───────────────────────────────────────────────
export async function criarMembro(formData: FormData) {
  const supabase = await createClient()

  const nome = formData.get('nome') as string
  const email = formData.get('email') as string
  const telefone = formData.get('telefone') as string
  const data_nascimento = formData.get('data_nascimento') as string
  const turma = formData.get('turma') as Turma
  const is_competicao = formData.get('is_competicao') === 'on'
  const is_isento = formData.get('is_isento') === 'on'
  const cota = parseFloat(formData.get('cota') as string) || 30
  const data_vencimento = formData.get('data_vencimento') as string
  const seguro_pago_raw = (formData.get('seguro_pago') as string) || ''
  const seguro_pago = seguro_pago_raw === 'dinheiro' || seguro_pago_raw === 'mbway' ? seguro_pago_raw : null
  const observacoes = formData.get('observacoes') as string
  const ano = anoAtual()

  const { data, error } = await (supabase.from('membros') as any).insert({
    nome,
    email: email || null,
    telefone: telefone || null,
    data_nascimento: data_nascimento || null,
    turma,
    is_competicao,
    is_isento,
    cota,
    data_vencimento: data_vencimento || null,
    seguro_pago,
    seguro_ano_pago: seguro_pago ? ano : null,
    observacoes: observacoes || null,
  }).select('id').single()

  if (error) {
    console.error('Erro ao criar membro:', error.message)
    redirect('/dashboard/membros?error=create_failed')
  }

  // Registar no log de atividades
  await logAction(supabase, 'CRIAR_MEMBRO', `Criou o membro "${nome}" na turma ${TURMA_LABELS[turma]}`, 'membro', data.id)

  revalidatePath('/dashboard/membros')
  redirect('/dashboard/membros')
}

// ─── EDITAR MEMBRO ──────────────────────────────────────────────
export async function editarMembro(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const nome = formData.get('nome') as string
  const email = formData.get('email') as string
  const telefone = formData.get('telefone') as string
  const data_nascimento = formData.get('data_nascimento') as string
  const turma = formData.get('turma') as Turma
  const is_competicao = formData.get('is_competicao') === 'on'
  const is_isento = formData.get('is_isento') === 'on'
  const cota = parseFloat(formData.get('cota') as string) || 30
  const data_vencimento = formData.get('data_vencimento') as string
  const seguro_pago_raw = (formData.get('seguro_pago') as string) || ''
  const seguro_pago = seguro_pago_raw === 'dinheiro' || seguro_pago_raw === 'mbway' ? seguro_pago_raw : null
  const observacoes = formData.get('observacoes') as string
  const ano = anoAtual()

  const { error } = await (supabase
    .from('membros') as any)
    .update({
      nome,
      email: email || null,
      telefone: telefone || null,
      data_nascimento: data_nascimento || null,
      turma,
      is_competicao,
      is_isento,
      cota,
      data_vencimento: data_vencimento || null,
      seguro_pago,
      seguro_ano_pago: seguro_pago ? ano : null,
      observacoes: observacoes || null,
    })
    .eq('id', id)

  if (error) {
    console.error('Erro ao editar membro:', error.message)
    redirect(`/dashboard/membros/${id}?error=update_failed`)
  }

  // Registar no log
  await logAction(supabase, 'EDITAR_MEMBRO', `Editou os dados do membro "${nome}"`, 'membro', id)

  revalidatePath('/dashboard/membros')
  revalidatePath(`/dashboard/membros/${id}`)
  redirect('/dashboard/membros')
}

// ─── ELIMINAR MEMBRO ────────────────────────────────────────────
export async function eliminarMembro(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  // Guardar o nome antes de apagar para o log
  const { data: membro } = await (supabase.from('membros').select('nome').eq('id', id).single() as any)
  const nomeMembro = membro?.nome || 'Desconhecido'

  // Limpar documentos do Storage
  const { data: files } = await supabase.storage.from('documentos').list(`membros/${id}`)
  if (files && files.length > 0) {
    const paths = files.map(f => `membros/${id}/${f.name}`)
    await supabase.storage.from('documentos').remove(paths)
  }

  const { error } = await supabase.from('membros').delete().eq('id', id)

  if (error) {
    console.error('Erro ao eliminar membro:', error.message)
    redirect('/dashboard/membros?error=delete_failed')
  }

  await logAction(supabase, 'ELIMINAR_MEMBRO', `Eliminou o membro "${nomeMembro}"`, 'membro', id)

  revalidatePath('/dashboard/membros')
  redirect('/dashboard/membros')
}

// ─── REGISTAR PAGAMENTO ─────────────────────────────────────────
export async function registarPagamento(formData: FormData) {
  const supabase = await createClient()

  const membro_id = formData.get('membro_id') as string
  const mes_referencia = formData.get('mes_referencia') as string
  const valor = parseFloat(formData.get('valor') as string)

  // Buscar nome do membro para o log
  const { data: membro } = await (supabase.from('membros').select('nome').eq('id', membro_id).single() as any)

  const { data, error } = await (supabase.from('pagamentos') as any).insert({
    membro_id,
    mes_referencia,
    valor,
  }).select('id').single()

  if (error) {
    console.error('Erro ao registar pagamento:', error.message)
    redirect(`/dashboard/membros/${membro_id}?error=payment_failed`)
  }

  await logAction(
    supabase,
    'REGISTAR_PAGAMENTO',
    `Registou pagamento de ${valor}€ (${mes_referencia}) para "${membro?.nome || 'N/A'}"`,
    'pagamento',
    data.id
  )

  revalidatePath(`/dashboard/membros/${membro_id}`)
  redirect(`/dashboard/membros/${membro_id}`)
}

// ─── ELIMINAR PAGAMENTO ─────────────────────────────────────────
export async function eliminarPagamento(formData: FormData) {
  const supabase = await createClient()

  const pagamento_id = formData.get('pagamento_id') as string
  const membro_id = formData.get('membro_id') as string

  // Buscar info do pagamento para o log
  const { data: pag } = await (supabase.from('pagamentos').select('mes_referencia, valor').eq('id', pagamento_id).single() as any)

  const { error } = await supabase.from('pagamentos').delete().eq('id', pagamento_id)

  if (error) {
    console.error('Erro ao eliminar pagamento:', error.message)
  }

  await logAction(
    supabase,
    'ELIMINAR_PAGAMENTO',
    `Removeu pagamento de ${pag?.valor || '?'}€ (${pag?.mes_referencia || '?'})`,
    'pagamento',
    pagamento_id
  )

  revalidatePath(`/dashboard/membros/${membro_id}`)
  redirect(`/dashboard/membros/${membro_id}`)
}

// ─── MEMBROS EM ATRASO ──────────────────────────────────────────
// Lê a view derivada `membros_status` (calculada no Postgres) e
// devolve apenas os que estão 'em_atraso'. Útil para widgets e
// relatórios do dashboard sem ter de replicar a lógica em TS.
export async function getMembrosOverdue() {
  const supabase = await createClient()
  const { data } = await (supabase.from('membros_status').select('*').eq('status', 'em_atraso') as any)
  return data || []
}
