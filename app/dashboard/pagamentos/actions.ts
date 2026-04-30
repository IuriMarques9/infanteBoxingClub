'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { toCSV } from '@/lib/csv'

// ─── EXPORTAR PAGAMENTOS EM CSV ─────────────────────────────────
// Devolve uma string CSV com todos os pagamentos no intervalo
// [from, to] (em formato "YYYY-MM"), opcionalmente filtrados por
// um único membro.
export async function exportPagamentosCSV(params: {
  from: string
  to: string
  membroId?: string
}): Promise<string> {
  const supabase = await createClient()

  let q: any = (supabase.from('pagamentos') as any)
    .select('*, membros(nome)')
    .gte('mes_referencia', params.from)
    .lte('mes_referencia', params.to)
    .order('mes_referencia', { ascending: false })

  if (params.membroId) q = q.eq('membro_id', params.membroId)

  const { data } = await q

  const rows = (data || []).map((p: any) => ({
    mes_referencia: p.mes_referencia,
    membro_nome: p.membros?.nome || '',
    valor: p.valor,
    data_pagamento: p.data_pagamento
      ? new Date(p.data_pagamento).toLocaleDateString('pt-PT')
      : '',
  }))

  return toCSV(rows, [
    { key: 'mes_referencia', label: 'Mês' },
    { key: 'membro_nome', label: 'Membro' },
    { key: 'valor', label: 'Valor (€)' },
    { key: 'data_pagamento', label: 'Data Pagamento' },
  ])
}

// ─── REGISTAR PAGAMENTOS EM LOTE ────────────────────────────────
// Recebe múltiplos membro_ids (checkboxes), um mês de referência
// e um valor. Filtra os que já têm pagamento desse mês e insere
// apenas os restantes. Regista um único log com a contagem.
export async function registarPagamentosLote(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const ids = formData.getAll('membro_ids[]') as string[]
  const mes_referencia = formData.get('mes_referencia') as string
  const valor = parseFloat(formData.get('valor') as string)

  if (!ids.length || !mes_referencia || isNaN(valor)) {
    return
  }

  // Filtrar os que já têm pagamento neste mês (idempotência)
  const { data: existentes } = await (supabase
    .from('pagamentos')
    .select('membro_id')
    .in('membro_id', ids)
    .eq('mes_referencia', mes_referencia) as any)
  const idsJaPagos = new Set((existentes || []).map((p: any) => p.membro_id))
  const idsParaInserir = ids.filter(id => !idsJaPagos.has(id))

  if (idsParaInserir.length === 0) {
    revalidatePath('/dashboard/pagamentos')
    return
  }

  const rows = idsParaInserir.map(membro_id => ({ membro_id, mes_referencia, valor }))

  const { error } = await (supabase.from('pagamentos') as any).insert(rows)

  if (error) {
    console.error('Erro ao registar pagamentos em lote:', error.message)
    return
  }

  const ignorados = idsJaPagos.size
  const descricaoIgnorados = ignorados > 0 ? ` (${ignorados} já pago(s) ignorado(s))` : ''
  await (supabase.from('activity_log') as any).insert({
    action: 'REGISTAR_PAGAMENTOS_LOTE',
    description: `Registou ${rows.length} pagamento(s) de ${valor}€ referentes a ${mes_referencia}${descricaoIgnorados}`,
    entity_type: 'pagamento',
  })

  revalidatePath('/dashboard/pagamentos')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/membros')
}

// ─── RELATÓRIO MENSAL (12 meses do ano indicado) ────────────────
// Carrega todos os pagamentos do ano e agrega em JS por mês,
// garantindo que os 12 meses aparecem mesmo que sem pagamentos.
export async function getRelatorioMensal(
  year: number
): Promise<{ mes: string; total: number; count: number }[]> {
  const supabase = await createClient()

  const from = `${year}-01`
  const to = `${year}-12`

  const { data } = await (supabase.from('pagamentos') as any)
    .select('mes_referencia, valor')
    .gte('mes_referencia', from)
    .lte('mes_referencia', to)

  // Inicializa os 12 meses
  const meses: { mes: string; total: number; count: number }[] = []
  for (let m = 1; m <= 12; m++) {
    const mesStr = `${year}-${String(m).padStart(2, '0')}`
    meses.push({ mes: mesStr, total: 0, count: 0 })
  }

  for (const p of data || []) {
    const idx = meses.findIndex(x => x.mes === p.mes_referencia)
    if (idx !== -1) {
      meses[idx].total += Number(p.valor) || 0
      meses[idx].count += 1
    }
  }

  return meses
}

// ─── ESTATÍSTICAS DE PAGAMENTOS ─────────────────────────────────
// Devolve métricas do mês atual:
//   totalMes:         soma dos pagamentos recebidos este mês
//   countMes:         nº de pagamentos registados este mês
//   receitaPrevista:  soma das cotas de todos os membros NÃO isentos
//   emAtraso:         nº de membros cuja view membros_status = em_atraso
export async function getPagamentosStats(): Promise<{
  totalMes: number
  countMes: number
  receitaPrevista: number
  emAtraso: number
}> {
  const supabase = await createClient()

  const mesAtual = new Date().toISOString().slice(0, 7)

  const [pagamentosRes, membrosRes, statusRes] = await Promise.all([
    (supabase.from('pagamentos') as any)
      .select('valor')
      .eq('mes_referencia', mesAtual),
    (supabase.from('membros') as any)
      .select('cota, is_isento')
      .eq('is_isento', false),
    (supabase.from('membros_status') as any)
      .select('id', { count: 'exact', head: true })
      .eq('status', 'em_atraso'),
  ])

  const pagamentosMes = pagamentosRes.data || []
  const totalMes = pagamentosMes.reduce(
    (acc: number, p: any) => acc + (Number(p.valor) || 0),
    0
  )
  const countMes = pagamentosMes.length

  const membrosNaoIsentos = membrosRes.data || []
  const receitaPrevista = membrosNaoIsentos.reduce(
    (acc: number, m: any) => acc + (Number(m.cota) || 0),
    0
  )

  const emAtraso = statusRes.count || 0

  return { totalMes, countMes, receitaPrevista, emAtraso }
}
