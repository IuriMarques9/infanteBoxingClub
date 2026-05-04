'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { toCSV } from '@/lib/csv'
import type { PagamentoRow, PagamentoTipo, SeguroTipo } from '@/lib/payments'
import { SEGURO_VALORES } from '@/lib/payments'

// ─── EXPORTAR PAGAMENTOS EM CSV ─────────────────────────────────
// Devolve uma string CSV com os pagamentos no intervalo (formato
// "YYYY-MM"), opcionalmente filtrados por membro e tipo. Aceita o
// novo argumento `tipo` para alinhar com a página /dashboard/pagamentos
// (anteriormente só filtrava cotas implicitamente via mes_referencia).
export async function exportPagamentosCSV(params: {
  from: string
  to: string
  membroId?: string
  tipo?: PagamentoTipo
}): Promise<string> {
  const supabase = await createClient()

  // Construir query — usar gte/lte em data_pagamento (funciona para todos
  // os tipos, não só cotas). Mantemos retro-compat para chamadores antigos
  // que passam from/to em formato YYYY-MM.
  const fromDate = `${params.from}-01`
  const toDate = `${params.to}-31`

  let q: any = (supabase.from('pagamentos') as any)
    .select('*, membros(nome)')
    .gte('data_pagamento', fromDate)
    .lte('data_pagamento', toDate)
    .order('data_pagamento', { ascending: false })

  if (params.membroId) q = q.eq('membro_id', params.membroId)
  if (params.tipo) q = q.eq('tipo', params.tipo)

  const { data } = await q

  const rows = (data || []).map((p: any) => ({
    tipo: p.tipo || 'cota',
    mes_referencia: p.mes_referencia || '',
    descricao: p.descricao || '',
    membro_nome: p.membros?.nome || '',
    valor: p.valor,
    data_pagamento: p.data_pagamento
      ? new Date(p.data_pagamento).toLocaleDateString('pt-PT')
      : '',
  }))

  return toCSV(rows, [
    { key: 'tipo', label: 'Tipo' },
    { key: 'mes_referencia', label: 'Mês' },
    { key: 'membro_nome', label: 'Membro' },
    { key: 'valor', label: 'Valor (€)' },
    { key: 'descricao', label: 'Descrição' },
    { key: 'data_pagamento', label: 'Data Pagamento' },
  ])
}

// ─── REGISTAR PAGAMENTOS EM LOTE (COTAS) ────────────────────────
// Recebe múltiplos membro_ids (checkboxes), um mês de referência
// e um valor. Filtra os que já têm cota desse mês e insere apenas
// os restantes. Regista um único log com a contagem.
export async function registarPagamentosLote(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const ids = formData.getAll('membro_ids[]') as string[]
  const mes_referencia = formData.get('mes_referencia') as string
  const valor = parseFloat(formData.get('valor') as string)

  if (!ids.length || !mes_referencia || isNaN(valor)) {
    return
  }

  // Filtrar os que já têm cota neste mês (idempotência)
  const { data: existentes } = await (supabase
    .from('pagamentos')
    .select('membro_id')
    .in('membro_id', ids)
    .eq('tipo', 'cota')
    .eq('mes_referencia', mes_referencia) as any)
  const idsJaPagos = new Set((existentes || []).map((p: any) => p.membro_id))
  const idsParaInserir = ids.filter(id => !idsJaPagos.has(id))

  if (idsParaInserir.length === 0) {
    revalidatePath('/dashboard/pagamentos')
    return
  }

  const rows = idsParaInserir.map(membro_id => ({
    membro_id,
    mes_referencia,
    valor,
    tipo: 'cota',
  }))

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

// ─── REGISTAR SEGURO ANUAL ──────────────────────────────────────
// Aplica a regra de negócio: 32€ recreativo / 45€ competidor.
// Se 45€ → marca o atleta como `is_competicao = true` automaticamente
// (independente do estado anterior; o admin pode reverter manualmente
// na ficha se for engano).
export async function registarSeguro(params: {
  membroId: string
  valor: number          // só aceita 32 ou 45 — validado abaixo
  ano: number
  metodo?: 'dinheiro' | 'mbway'
}): Promise<{ ok?: boolean; error?: string }> {
  if (params.valor !== SEGURO_VALORES.recreativo && params.valor !== SEGURO_VALORES.competicao) {
    return { error: `Valor de seguro inválido. Apenas ${SEGURO_VALORES.recreativo}€ ou ${SEGURO_VALORES.competicao}€.` }
  }

  const supabase = await createClient()

  // 1. Insert na tabela pagamentos
  const dataPag = new Date(params.ano, 0, 1).toISOString()
  const { error: insertErr } = await (supabase.from('pagamentos') as any).insert({
    membro_id: params.membroId,
    tipo: 'seguro',
    valor: params.valor,
    descricao: `Seguro ${params.ano}${params.metodo ? ` · ${params.metodo}` : ''}`,
    data_pagamento: dataPag,
  })
  if (insertErr) return { error: `Erro a registar seguro: ${insertErr.message}` }

  // 2. Compat: actualizar colunas legacy `seguro_pago`/`seguro_ano_pago` em membros
  // 3. Aplicar regra de competição se valor=45
  const updates: any = {
    seguro_ano_pago: params.ano,
    seguro_pago: params.metodo ?? 'mbway',
  }
  const competicaoBefore = params.valor === SEGURO_VALORES.competicao
  if (competicaoBefore) updates.is_competicao = true

  const { error: updErr } = await (supabase.from('membros') as any)
    .update(updates)
    .eq('id', params.membroId)
  if (updErr) return { error: `Erro a actualizar membro: ${updErr.message}` }

  // 4. Activity log
  const tagCompeticao = competicaoBefore ? ' + marcou como competidor' : ''
  await (supabase.from('activity_log') as any).insert({
    action: 'REGISTAR_SEGURO',
    description: `Registou seguro ${params.ano} (${params.valor}€)${tagCompeticao}`,
    entity_type: 'membro',
    entity_id: params.membroId,
  })

  revalidatePath('/dashboard/pagamentos')
  revalidatePath('/dashboard/membros')
  revalidatePath(`/dashboard/membros/${params.membroId}`)
  revalidatePath('/dashboard')
  return { ok: true }
}

// ─── REGISTAR PAGAMENTO LIVRE ───────────────────────────────────
// Para casos avulsos (tipo='outro'), ou no futuro loja/eventos.
export async function registarPagamento(params: {
  membroId: string
  tipo: PagamentoTipo
  valor: number
  descricao?: string
  mes_referencia?: string
  data_pagamento?: string
  referencia_id?: string
}): Promise<{ ok?: boolean; error?: string }> {
  if (params.tipo === 'cota' && !params.mes_referencia) {
    return { error: 'Cotas exigem mês de referência.' }
  }
  if (isNaN(params.valor) || params.valor <= 0) {
    return { error: 'Valor inválido.' }
  }

  const supabase = await createClient()
  const { error } = await (supabase.from('pagamentos') as any).insert({
    membro_id: params.membroId,
    tipo: params.tipo,
    valor: params.valor,
    descricao: params.descricao ?? null,
    mes_referencia: params.mes_referencia ?? null,
    data_pagamento: params.data_pagamento ?? new Date().toISOString(),
    referencia_id: params.referencia_id ?? null,
  })
  if (error) return { error: error.message }

  await (supabase.from('activity_log') as any).insert({
    action: 'REGISTAR_PAGAMENTO',
    description: `Registou pagamento ${params.tipo} de ${params.valor}€${params.descricao ? ` · ${params.descricao}` : ''}`,
    entity_type: 'pagamento',
    entity_id: params.membroId,
  })

  revalidatePath('/dashboard/pagamentos')
  revalidatePath(`/dashboard/membros/${params.membroId}`)
  revalidatePath('/dashboard')
  return { ok: true }
}

// ─── EDITAR PAGAMENTO ───────────────────────────────────────────
export async function editarPagamento(
  id: string,
  patch: { valor?: number; mes_referencia?: string | null; descricao?: string | null; data_pagamento?: string },
): Promise<{ ok?: boolean; error?: string }> {
  if (!id) return { error: 'ID em falta.' }
  if (patch.valor !== undefined && (isNaN(patch.valor) || patch.valor <= 0)) {
    return { error: 'Valor inválido.' }
  }

  const supabase = await createClient()
  const { data: before } = await (supabase
    .from('pagamentos')
    .select('membro_id, tipo, valor, mes_referencia')
    .eq('id', id)
    .maybeSingle() as any)

  const { error } = await (supabase.from('pagamentos') as any)
    .update(patch)
    .eq('id', id)
  if (error) return { error: error.message }

  // Para seguros: se mudaram a data, sincronizar `seguro_ano_pago` em membros
  if (before?.tipo === 'seguro' && patch.data_pagamento) {
    const novoAno = new Date(patch.data_pagamento).getFullYear()
    await (supabase.from('membros') as any)
      .update({ seguro_ano_pago: novoAno })
      .eq('id', before.membro_id)
  }

  await (supabase.from('activity_log') as any).insert({
    action: 'EDITAR_PAGAMENTO',
    description: `Editou pagamento (id ${id.slice(0, 8)}…)`,
    entity_type: 'pagamento',
    entity_id: before?.membro_id ?? null,
  })

  revalidatePath('/dashboard/pagamentos')
  if (before?.membro_id) revalidatePath(`/dashboard/membros/${before.membro_id}`)
  return { ok: true }
}

// ─── ELIMINAR PAGAMENTO ─────────────────────────────────────────
// Para seguros, repõe `seguro_ano_pago = NULL` em `membros`. Não
// reverte `is_competicao` automaticamente (decisão do utilizador).
export async function eliminarPagamento(id: string): Promise<{ ok?: boolean; error?: string }> {
  if (!id) return { error: 'ID em falta.' }
  const supabase = await createClient()

  const { data: before } = await (supabase
    .from('pagamentos')
    .select('membro_id, tipo, mes_referencia, valor')
    .eq('id', id)
    .maybeSingle() as any)

  const { error } = await (supabase.from('pagamentos') as any).delete().eq('id', id)
  if (error) return { error: error.message }

  // Compat: se era um seguro, limpar flag em membros (último seguro daquele ano)
  if (before?.tipo === 'seguro' && before.membro_id) {
    // Verificar se ainda existe outro seguro do mesmo ano para este membro
    const { data: outros } = await (supabase
      .from('pagamentos')
      .select('id')
      .eq('membro_id', before.membro_id)
      .eq('tipo', 'seguro')
      .limit(1) as any)
    if (!outros || outros.length === 0) {
      await (supabase.from('membros') as any)
        .update({ seguro_ano_pago: null, seguro_pago: null })
        .eq('id', before.membro_id)
    }
  }

  await (supabase.from('activity_log') as any).insert({
    action: 'ELIMINAR_PAGAMENTO',
    description: `Eliminou pagamento ${before?.tipo ?? ''} de ${before?.valor ?? '?'}€${before?.mes_referencia ? ` (${before.mes_referencia})` : ''}`,
    entity_type: 'pagamento',
    entity_id: before?.membro_id ?? null,
  })

  revalidatePath('/dashboard/pagamentos')
  revalidatePath('/dashboard')
  if (before?.membro_id) revalidatePath(`/dashboard/membros/${before.membro_id}`)
  return { ok: true }
}

// ─── LISTAR PAGAMENTOS COM FILTROS + PAGINAÇÃO ──────────────────
export async function listarPagamentos(params: {
  tipo?: PagamentoTipo
  from?: string         // YYYY-MM
  to?: string           // YYYY-MM
  membroId?: string
  turma?: string
  page?: number
  pageSize?: number
} = {}): Promise<{ rows: PagamentoRow[]; total: number }> {
  const supabase = await createClient()
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.min(200, Math.max(10, params.pageSize ?? 50))
  const offset = (page - 1) * pageSize

  let q: any = (supabase.from('pagamentos') as any)
    .select(
      '*, membros!inner(nome, turma, is_competicao, email, telefone, cota)',
      { count: 'exact' },
    )
    .order('data_pagamento', { ascending: false })

  if (params.tipo)     q = q.eq('tipo', params.tipo)
  if (params.membroId) q = q.eq('membro_id', params.membroId)
  if (params.turma)    q = q.eq('membros.turma', params.turma)
  if (params.from)     q = q.gte('data_pagamento', `${params.from}-01`)
  if (params.to)       q = q.lte('data_pagamento', `${params.to}-31`)

  q = q.range(offset, offset + pageSize - 1)
  const { data, count } = await q

  return { rows: (data || []) as PagamentoRow[], total: count ?? 0 }
}

// ─── RELATÓRIO MENSAL (12 meses) ────────────────────────────────
// Continua a ser usado pelo dashboard home. Aceita `tipo?` opcional
// para filtrar (ex: só cotas). Default = todos os tipos somados.
export async function getRelatorioMensal(
  year: number,
  tipo?: PagamentoTipo,
): Promise<{ mes: string; total: number; count: number }[]> {
  const supabase = await createClient()
  const fromDate = `${year}-01-01`
  const toDate = `${year}-12-31`

  let q: any = (supabase.from('pagamentos') as any)
    .select('data_pagamento, valor, tipo, mes_referencia')
    .gte('data_pagamento', fromDate)
    .lte('data_pagamento', toDate)

  if (tipo) q = q.eq('tipo', tipo)

  const { data } = await q

  const meses: { mes: string; total: number; count: number }[] = []
  for (let m = 1; m <= 12; m++) {
    meses.push({ mes: `${year}-${String(m).padStart(2, '0')}`, total: 0, count: 0 })
  }

  for (const p of data || []) {
    // Para cotas usa mes_referencia, para os outros usa data_pagamento.
    let key: string | null = null
    if (p.tipo === 'cota' && p.mes_referencia) {
      key = p.mes_referencia
    } else if (p.data_pagamento) {
      key = p.data_pagamento.slice(0, 7) // YYYY-MM
    }
    if (!key) continue
    const idx = meses.findIndex(x => x.mes === key)
    if (idx !== -1) {
      meses[idx].total += Number(p.valor) || 0
      meses[idx].count += 1
    }
  }

  return meses
}

// ─── ESTATÍSTICAS DE PAGAMENTOS ─────────────────────────────────
// Devolve métricas do mês atual. `totalMes` agora inclui cotas +
// seguros do mês corrente (ambos contam como receita real). `countMes`
// é o número total de pagamentos.
export async function getPagamentosStats(): Promise<{
  totalMes: number
  totalCotasMes: number
  totalSegurosMes: number
  countMes: number
  receitaPrevista: number
  emAtraso: number
}> {
  const supabase = await createClient()
  const mesAtual = new Date().toISOString().slice(0, 7)
  const fromDate = `${mesAtual}-01`
  const toDate = `${mesAtual}-31`

  const [pagamentosRes, membrosRes, statusRes] = await Promise.all([
    (supabase.from('pagamentos') as any)
      .select('valor, tipo')
      .gte('data_pagamento', fromDate)
      .lte('data_pagamento', toDate),
    (supabase.from('membros') as any)
      .select('cota, is_isento')
      .eq('is_isento', false),
    (supabase.from('membros_status') as any)
      .select('id', { count: 'exact', head: true })
      .eq('status', 'em_atraso'),
  ])

  const pagamentosMes = pagamentosRes.data || []
  let totalCotasMes = 0
  let totalSegurosMes = 0
  let totalMes = 0
  for (const p of pagamentosMes) {
    const v = Number(p.valor) || 0
    totalMes += v
    if (p.tipo === 'cota') totalCotasMes += v
    else if (p.tipo === 'seguro') totalSegurosMes += v
  }
  const countMes = pagamentosMes.length

  const membrosNaoIsentos = membrosRes.data || []
  const receitaPrevista = membrosNaoIsentos.reduce(
    (acc: number, m: any) => acc + (Number(m.cota) || 0),
    0,
  )

  const emAtraso = statusRes.count || 0

  return { totalMes, totalCotasMes, totalSegurosMes, countMes, receitaPrevista, emAtraso }
}

// ─── DEVEDORES DESTE MÊS ────────────────────────────────────────
// Membros não-isentos sem cota registada para o mês indicado.
export async function getDevedoresDoMes(mes: string, limit = 50): Promise<{
  membro_id: string
  nome: string
  email: string | null
  telefone: string | null
  turma: string
  cota: number
}[]> {
  const supabase = await createClient()

  // 1. Todos os membros não-isentos
  const { data: membros } = await (supabase.from('membros') as any)
    .select('id, nome, email, telefone, turma, cota')
    .eq('is_isento', false)

  // 2. Quem já pagou cota deste mês
  const { data: pagosData } = await (supabase.from('pagamentos') as any)
    .select('membro_id')
    .eq('tipo', 'cota')
    .eq('mes_referencia', mes)
  const idsPagos = new Set((pagosData || []).map((p: any) => p.membro_id))

  // 3. Filtrar e ordenar
  const devedores = (membros || [])
    .filter((m: any) => !idsPagos.has(m.id))
    .map((m: any) => ({
      membro_id: m.id,
      nome: m.nome,
      email: m.email ?? null,
      telefone: m.telefone ?? null,
      turma: m.turma,
      cota: Number(m.cota ?? 30),
    }))
    .sort((a: any, b: any) => a.nome.localeCompare(b.nome))
    .slice(0, limit)

  return devedores
}

// ─── TOP DEVEDORES DO ANO ───────────────────────────────────────
// Para cada membro não-isento, conta os meses do ano em que NÃO
// pagou cota (até ao mês actual). Devolve top N.
export async function getTopDevedores(
  year: number,
  limit = 10,
): Promise<{ membro_id: string; nome: string; turma: string; mesesEmAtraso: number; valorEmAtraso: number }[]> {
  const supabase = await createClient()

  const { data: membros } = await (supabase.from('membros') as any)
    .select('id, nome, turma, cota')
    .eq('is_isento', false)

  // Mês actual (não conta meses futuros como atraso)
  const now = new Date()
  const mesActualStr = now.toISOString().slice(0, 7)
  const isCurrentYear = year === now.getFullYear()

  const { data: pagamentos } = await (supabase.from('pagamentos') as any)
    .select('membro_id, mes_referencia')
    .eq('tipo', 'cota')
    .gte('mes_referencia', `${year}-01`)
    .lte('mes_referencia', `${year}-12`)

  // Mapear meses pagos por membro
  const pagosPorMembro = new Map<string, Set<string>>()
  for (const p of pagamentos || []) {
    if (!pagosPorMembro.has(p.membro_id)) pagosPorMembro.set(p.membro_id, new Set())
    pagosPorMembro.get(p.membro_id)!.add(p.mes_referencia)
  }

  const result: { membro_id: string; nome: string; turma: string; mesesEmAtraso: number; valorEmAtraso: number }[] = []
  for (const m of membros || []) {
    let mesesEmAtraso = 0
    for (let mm = 1; mm <= 12; mm++) {
      const k = `${year}-${String(mm).padStart(2, '0')}`
      // Não conta meses futuros do ano corrente
      if (isCurrentYear && k > mesActualStr) break
      if (!pagosPorMembro.get(m.id)?.has(k)) mesesEmAtraso++
    }
    if (mesesEmAtraso > 0) {
      result.push({
        membro_id: m.id,
        nome: m.nome,
        turma: m.turma,
        mesesEmAtraso,
        valorEmAtraso: mesesEmAtraso * (Number(m.cota) || 30),
      })
    }
  }

  result.sort((a, b) => b.mesesEmAtraso - a.mesesEmAtraso || b.valorEmAtraso - a.valorEmAtraso)
  return result.slice(0, limit)
}

// ─── RECEITA ANUAL (acumulada vs prevista) ──────────────────────
export async function getReceitaAnual(year: number): Promise<{
  acumulado: number
  previstoMensal: number   // soma das cotas dos não-isentos
  porMes: { mes: string; total: number }[]
}> {
  const meses = await getRelatorioMensal(year)
  const acumulado = meses.reduce((s, m) => s + m.total, 0)

  const supabase = await createClient()
  const { data: membros } = await (supabase.from('membros') as any)
    .select('cota')
    .eq('is_isento', false)
  const previstoMensal = (membros || []).reduce(
    (s: number, m: any) => s + (Number(m.cota) || 0),
    0,
  )

  return {
    acumulado,
    previstoMensal,
    porMes: meses.map(m => ({ mes: m.mes, total: m.total })),
  }
}

// ─── COMPARAÇÃO YoY (12 meses do ano corrente vs anterior) ──────
export async function compararAnosYoY(thisYear: number): Promise<{
  mes: string       // só "MM" (Jan, Fev, ...)
  atual: number
  anterior: number
}[]> {
  const [actual, anterior] = await Promise.all([
    getRelatorioMensal(thisYear),
    getRelatorioMensal(thisYear - 1),
  ])
  return actual.map((m, i) => ({
    mes: m.mes.slice(5), // "MM"
    atual: m.total,
    anterior: anterior[i]?.total ?? 0,
  }))
}

// ─── PAGAMENTOS DE UM MEMBRO (para a matriz na ficha) ───────────
export async function getPagamentosMembro(
  membroId: string,
  year: number,
): Promise<{
  cotasPagas: string[]            // ["2026-01", "2026-02", ...]
  seguro: { ano: number; valor: number; descricao: string | null } | null
}> {
  const supabase = await createClient()

  const { data } = await (supabase.from('pagamentos') as any)
    .select('tipo, mes_referencia, valor, descricao, data_pagamento')
    .eq('membro_id', membroId)
    .gte('data_pagamento', `${year}-01-01`)
    .lte('data_pagamento', `${year}-12-31`)

  const cotasPagas: string[] = []
  let seguro: { ano: number; valor: number; descricao: string | null } | null = null
  for (const p of data || []) {
    if (p.tipo === 'cota' && p.mes_referencia) cotasPagas.push(p.mes_referencia)
    else if (p.tipo === 'seguro') {
      seguro = {
        ano: new Date(p.data_pagamento).getFullYear(),
        valor: Number(p.valor) || 0,
        descricao: p.descricao,
      }
    }
  }
  return { cotasPagas, seguro }
}
