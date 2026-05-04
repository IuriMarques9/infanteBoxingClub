'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { Turma, TURMA_LABELS, StatusMembro, STATUS_CONFIG } from './constants'
import { anoAtual, calcularIdade } from '@/lib/membros-estado'
import { toCSV } from '@/lib/csv'

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

  // Bloquear duplicados (índice único também protege na BD).
  const { data: existente } = await (supabase
    .from('pagamentos')
    .select('id')
    .eq('membro_id', membro_id)
    .eq('mes_referencia', mes_referencia)
    .maybeSingle() as any)
  if (existente) {
    redirect(`/dashboard/membros/${membro_id}?error=ja_pago`)
  }

  const { data, error } = await (supabase.from('pagamentos') as any).insert({
    membro_id,
    mes_referencia,
    valor,
  }).select('id').single()

  if (error) {
    console.error('Erro ao registar pagamento:', error.message)
    // Postgres unique_violation = 23505 (caso a corrida atravesse o select acima).
    const code = (error as any).code
    redirect(`/dashboard/membros/${membro_id}?error=${code === '23505' ? 'ja_pago' : 'payment_failed'}`)
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

// ─── MARCAR PAGAMENTO USANDO COTA DO MEMBRO ───────────────────
// Para cada ID, regista um pagamento com o valor da `cota` do
// próprio membro (em vez de um valor fixo). Ignora membros isentos
// e os que já têm pagamento desse mês. Mantém um único registo no
// activity_log por ação em lote.
export async function marcarPagamentosCota(
  ids: string[],
  mes_referencia: string,
): Promise<{ ok?: boolean; count?: number; isentos?: number; jaPagos?: number; error?: string }> {
  const supabase = await createClient()
  if (!ids.length || !mes_referencia) return { error: 'Parâmetros em falta.' }

  // Buscar cotas + isenção dos membros selecionados
  const { data: membros, error: fetchErr } = await (supabase
    .from('membros')
    .select('id, cota, is_isento')
    .in('id', ids) as any)
  if (fetchErr) return { error: fetchErr.message }

  const naoIsentos = (membros || []).filter((m: any) => !m.is_isento)
  const isentos = (membros || []).length - naoIsentos.length
  if (naoIsentos.length === 0) return { error: 'Nenhum membro elegível (todos isentos).' }

  // Filtrar os que já têm cota deste mês (idempotência por tipo='cota')
  const { data: existentes } = await (supabase
    .from('pagamentos')
    .select('membro_id')
    .in('membro_id', naoIsentos.map((m: any) => m.id))
    .eq('tipo', 'cota')
    .eq('mes_referencia', mes_referencia) as any)

  const idsJaPagos = new Set((existentes || []).map((p: any) => p.membro_id))
  const elegíveis = naoIsentos.filter((m: any) => !idsJaPagos.has(m.id))

  if (elegíveis.length === 0) {
    return { ok: true, count: 0, isentos, jaPagos: idsJaPagos.size }
  }

  const rows = elegíveis.map((m: any) => ({
    membro_id: m.id,
    mes_referencia,
    valor: Number(m.cota ?? 30),  // fallback 30€ se cota for null
    tipo: 'cota',
  }))

  const total = rows.reduce((s: number, r: { valor: number }) => s + r.valor, 0)

  const { error: insertErr } = await (supabase.from('pagamentos') as any).insert(rows)
  if (insertErr) return { error: insertErr.message }

  await (supabase.from('activity_log') as any).insert({
    action: 'REGISTAR_PAGAMENTOS_LOTE',
    description: `Registou ${rows.length} pagamento(s) (total ${total}€) referentes a ${mes_referencia}`,
    entity_type: 'pagamento',
  })

  revalidatePath('/dashboard/membros')
  revalidatePath('/dashboard/pagamentos')
  revalidatePath('/dashboard')

  return { ok: true, count: rows.length, isentos, jaPagos: idsJaPagos.size }
}

// ─── ELIMINAR MEMBROS EM LOTE ──────────────────────────────────
// Apaga vários membros de uma vez. Cada um regista no activity_log.
// Pagamentos/documentos relacionados devem ter ON DELETE CASCADE.
export async function eliminarMembrosLote(
  ids: string[],
): Promise<{ ok?: boolean; count?: number; error?: string }> {
  const supabase = await createClient()
  if (!ids.length) return { error: 'Nenhum membro selecionado.' }

  // Buscar nomes para o log
  const { data: membros } = await (supabase
    .from('membros')
    .select('id, nome')
    .in('id', ids) as any)
  const nomes = (membros || []).map((m: any) => m.nome)

  const { error } = await (supabase.from('membros') as any).delete().in('id', ids)
  if (error) return { error: error.message }

  await (supabase.from('activity_log') as any).insert({
    action: 'ELIMINAR_MEMBRO',
    description: `Eliminou ${ids.length} membro(s): ${nomes.slice(0, 5).join(', ')}${nomes.length > 5 ? `, +${nomes.length - 5}` : ''}`,
    entity_type: 'membro',
  })

  revalidatePath('/dashboard/membros')
  revalidatePath('/dashboard')

  return { ok: true, count: ids.length }
}

// ─── EXPORT CSV DE MEMBROS ──────────────────────────────────────
// Recebe uma lista de IDs e devolve um CSV com os dados principais
// dos membros (nome, email, telefone, turma, idade, cota, isento).
// Se ids vier vazio, devolve TODOS os membros (export total).
export async function exportMembrosCSV(ids: string[]): Promise<string> {
  const supabase = await createClient()

  let query: any = (supabase.from('membros') as any)
    .select('id, nome, email, telefone, turma, data_nascimento, cota, is_isento, is_competicao, seguro_ano_pago, observacoes')
    .order('nome', { ascending: true })

  if (ids && ids.length > 0) {
    query = query.in('id', ids)
  }

  const { data } = await query
  const rows = (data || []).map((m: any) => ({
    nome: m.nome,
    email: m.email || '',
    telefone: m.telefone || '',
    turma: TURMA_LABELS[m.turma as Turma] || m.turma,
    idade: calcularIdade(m.data_nascimento) ?? '',
    data_nascimento: m.data_nascimento || '',
    cota: m.cota ?? '',
    isento: m.is_isento ? 'Sim' : 'Não',
    competicao: m.is_competicao ? 'Sim' : 'Não',
    seguro_ano_pago: m.seguro_ano_pago ?? '',
    observacoes: m.observacoes || '',
  }))

  return toCSV(rows, [
    { key: 'nome',            label: 'Nome' },
    { key: 'email',           label: 'Email' },
    { key: 'telefone',        label: 'Telefone' },
    { key: 'turma',           label: 'Turma' },
    { key: 'idade',           label: 'Idade' },
    { key: 'data_nascimento', label: 'Data Nascimento' },
    { key: 'cota',            label: 'Cota (€)' },
    { key: 'isento',          label: 'Isento' },
    { key: 'competicao',      label: 'Competição' },
    { key: 'seguro_ano_pago', label: 'Seguro (Ano)' },
    { key: 'observacoes',     label: 'Observações' },
  ])
}
