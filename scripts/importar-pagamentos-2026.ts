// Script de import bulk de pagamentos (cotas + seguros) de 2026 a partir
// do ODS "Lista de Pagamentos 2026.ods".
//
// Uso:
//   npx tsx scripts/importar-pagamentos-2026.ts <ficheiro.ods>           # dry-run
//   npx tsx scripts/importar-pagamentos-2026.ts <ficheiro.ods> --apply   # executa
//
// Estrutura esperada do ODS:
//   1 sheet por turma (GATINHOS, SURICATAS, LEÕES, ADULTOS, WOMAN'S)
//   Header: Atletas | Inspeção Médica | Seguro Pago | Inscrito | Cota |
//           Janeiro | (valor) | Fevereiro | (valor) | … | Dezembro | (valor)
//
//   Cada mês ocupa DUAS colunas: "MÉTODO DD.MM" + "VALOR €".
//   Seguro: "DD.MM (32€) MBWAY" ou similar.
//
// Idempotente — re-correr não duplica entradas.

import { config as loadEnv } from 'dotenv'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

loadEnv({ path: '.env.local' })

// ─── ARGS ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const odsPath = args.find(a => !a.startsWith('--'))
const apply = args.includes('--apply')

if (!odsPath) {
  console.error('Uso: npx tsx scripts/importar-pagamentos-2026.ts <ficheiro.ods> [--apply]')
  process.exit(1)
}

const YEAR = 2026
const ADMIN_FALLBACK_ID = '4b86c5cd-f4d3-4ca7-9619-c337b60cabab' // Iuri (super-admin)

// Map sheet name normalizado (lowercase + sem acentos + sem apóstrofes
// — porque os ODS apresentam variantes WOMAN'S / WOMAN'S / WOMAN´S
// consoante o teclado).
function normalizeSheet(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // diacritics
    .replace(/[^a-zA-Z0-9]/g, '')    // só letras/digits
    .toLowerCase()
}

const TURMA_MAP: Record<string, string> = {
  gatinhos: 'gatinhos',
  suricatas: 'suricatas',
  leoes: 'leoes',
  adultos: 'adultos',
  womans: 'mulheres',
  mulheres: 'mulheres',
  women: 'mulheres',
}

const MESES_LABELS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

// ─── HELPERS ──────────────────────────────────────────────────────────
function normalize(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

/** "30,00 €" or "30.00€" or "30" → 30; vazio → null. */
function parseValor(s: any): number | null {
  if (s === undefined || s === null) return null
  const txt = String(s).trim()
  if (!txt) return null
  // Extrair primeiro número (suporta "30,00 €", "30,00€", "30€", "30")
  const m = txt.match(/(\d+(?:[,.]\d+)?)/)
  if (!m) return null
  const n = parseFloat(m[1].replace(',', '.'))
  return isNaN(n) ? null : n
}

/** "MBWAY 27.01" → { metodo: 'mbway', dia: '27', mes: '01' }; vazio → null. */
function parseCelulaPagamento(s: any): { metodo: string; dia: string; mes: string } | null {
  if (s === undefined || s === null) return null
  const txt = String(s).trim()
  if (!txt) return null
  // Formato típico: "MBWAY 27.01" ou "DINHEIRO 06.01" — ignora espaços extra
  const m = txt.match(/^(MBWAY|DINHEIRO|TRANSFERENCIA|TRANSFER[EÊ]NCIA)[\s.]*(\d{1,2})[./](\d{1,2})/i)
  if (!m) return null
  return {
    metodo: m[1].toLowerCase().startsWith('mb') ? 'mbway' : 'dinheiro',
    dia: m[2].padStart(2, '0'),
    mes: m[3].padStart(2, '0'),
  }
}

/** "05.03 (32€) DINHEIRO" → { dia, mes, valor: 32, metodo: 'dinheiro' } */
function parseSeguro(s: any): { dia: string; mes: string; valor: number; metodo: string } | null {
  if (s === undefined || s === null) return null
  const txt = String(s).trim()
  if (!txt) return null
  // Formato típico: "DD.MM (V€) MÉTODO"
  const m = txt.match(/(\d{1,2})[./](\d{1,2})\s*\((\d+)\s*€?\)\s*(MBWAY|DINHEIRO)?/i)
  if (!m) return null
  const metodoRaw = (m[4] || 'mbway').toLowerCase()
  return {
    dia: m[1].padStart(2, '0'),
    mes: m[2].padStart(2, '0'),
    valor: parseInt(m[3], 10),
    metodo: metodoRaw.startsWith('mb') ? 'mbway' : 'dinheiro',
  }
}

/** Cria ISO date com fallback robusto. Tenta (year, mes, dia); se inválido,
 *  cai para dia 15 do mes_ref; último fallback é primeiro dia do mes_ref. */
function safeDate(year: number, mes: number, dia: number, mesRef: number): string {
  // Construir via Date(year, monthIdx, day) — usa rollover suave do JS
  const d = new Date(year, mes - 1, dia, 12, 0, 0)
  if (isNaN(d.getTime()) || d.getMonth() !== mes - 1) {
    // rollover ocorreu (ex: 31.04 vira 01.05) — usar dia 15 do mes_ref
    return new Date(year, mesRef - 1, 15, 12, 0, 0).toISOString()
  }
  return d.toISOString()
}

function csvEscape(s: any): string {
  const v = String(s ?? '')
  return `"${v.replace(/"/g, '""')}"`
}

function writeCsv(path: string, header: string[], rows: string[][]) {
  const lines = [header.map(csvEscape).join(','), ...rows.map(r => r.map(csvEscape).join(','))]
  writeFileSync(path, lines.join('\n'), 'utf8')
}

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !serviceKey) {
  console.error('❌ Faltam NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local')
  process.exit(1)
}
const admin = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// ─── PARSING DO ODS ───────────────────────────────────────────────────
interface Atleta {
  nome: string
  turma: string
  cota: number | null
  seguro: { dia: string; mes: string; valor: number; metodo: string } | null
  /**
   * `mes` = mês de referência (coluna do ODS, 1..12)
   * `mesPagamento` = mês textual da célula (quando foi realmente pago)
   * `dia` = dia textual da célula
   * Ex: célula "MBWAY 27.01" na coluna Fevereiro → mes=2, mesPagamento=1, dia=27
   */
  cotas: { mes: number; mesPagamento: number; dia: number; metodo: string; valor: number }[]
}

function parseODS(absPath: string): Atleta[] {
  const wb = XLSX.read(readFileSync(absPath), { type: 'buffer' })
  const atletas: Atleta[] = []

  for (const sheetName of wb.SheetNames) {
    const turma = TURMA_MAP[normalizeSheet(sheetName)]
    if (!turma) {
      console.log(`⚠️  Sheet "${sheetName}" não corresponde a turma conhecida — ignorada`)
      continue
    }
    const ws = wb.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: '' })
    if (rows.length < 2) continue

    // Linha 0: header. Saltamos.
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r]
      const nome = String(row[0] || '').trim()
      if (!nome) continue
      // Linha de totais — começa com vazio mas tem valores
      if (!nome.match(/[a-zA-ZÀ-ÿ]/)) continue

      const cota = parseValor(row[4])
      const seguro = parseSeguro(row[2])
      const cotas: Atleta['cotas'] = []

      // Colunas 5..27 (par índice = método+data, ímpar = valor) — 12 meses × 2
      for (let mes = 1; mes <= 12; mes++) {
        const idxMetodo = 5 + (mes - 1) * 2
        const idxValor = idxMetodo + 1
        const cell = parseCelulaPagamento(row[idxMetodo])
        const v = parseValor(row[idxValor])
        if (cell && v !== null) {
          const dia = parseInt(cell.dia, 10) || 15
          const mesPagamento = parseInt(cell.mes, 10) || mes
          cotas.push({ mes, mesPagamento, dia, metodo: cell.metodo, valor: v })
        }
      }

      atletas.push({ nome, turma, cota, seguro, cotas })
    }
  }

  return atletas
}

// ─── MATCHING ──────────────────────────────────────────────────────────
interface Membro {
  id: string
  nome: string
  turma: string
  is_competicao: boolean
  cota: number | null
}

async function matchAtleta(atleta: Atleta, membros: Membro[]): Promise<Membro | null> {
  const target = normalize(atleta.nome)
  // 1. Match exacto normalizado
  let cand = membros.filter(m => normalize(m.nome) === target)
  if (cand.length === 1) return cand[0]
  if (cand.length > 1) {
    // Preferir mesma turma
    const sameT = cand.filter(m => m.turma === atleta.turma)
    if (sameT.length === 1) return sameT[0]
    return null
  }
  // 2. Match parcial: primeiro+último nome
  const tokens = target.split(' ').filter(t => t.length >= 2)
  if (tokens.length >= 2) {
    const first = tokens[0]
    const last = tokens[tokens.length - 1]
    cand = membros.filter(m => {
      const n = normalize(m.nome)
      return n.startsWith(first) && n.endsWith(last)
    })
    if (cand.length === 1) return cand[0]
  }
  return null
}

// ─── FLOW ─────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${'━'.repeat(60)}`)
  console.log(`📥 IMPORT DE PAGAMENTOS ${YEAR} — ${apply ? 'MODO REAL' : 'DRY-RUN'}`)
  console.log(`${'━'.repeat(60)}\n`)

  const absPath = resolve(odsPath!)
  console.log(`📄 A ler: ${absPath}`)
  const atletas = parseODS(absPath)
  console.log(`   ${atletas.length} atletas detectados em ${atletas.reduce((s, a) => s + (a.seguro ? 1 : 0), 0)} seguros + ${atletas.reduce((s, a) => s + a.cotas.length, 0)} cotas mensais.\n`)

  // Distribuição por turma
  const porTurma: Record<string, number> = {}
  for (const a of atletas) porTurma[a.turma] = (porTurma[a.turma] || 0) + 1
  console.log('Por turma:')
  Object.entries(porTurma).forEach(([t, n]) => console.log(`   ${t.padEnd(15)} ${n}`))
  console.log()

  // Carregar membros
  console.log('👥 A carregar membros da BD...')
  const { data: membrosData, error: membrosErr } = await admin
    .from('membros')
    .select('id, nome, turma, is_competicao, cota')
  if (membrosErr || !membrosData) {
    console.error('❌ Falha a ler membros:', membrosErr?.message)
    process.exit(1)
  }
  const membros = membrosData as Membro[]
  console.log(`   ${membros.length} membros encontrados\n`)

  // Match
  const matched: { atleta: Atleta; membro: Membro }[] = []
  const unmatched: Atleta[] = []
  for (const a of atletas) {
    const m = await matchAtleta(a, membros)
    if (m) matched.push({ atleta: a, membro: m })
    else unmatched.push(a)
  }

  console.log(`✅ ${matched.length} atletas com match`)
  console.log(`❌ ${unmatched.length} atletas sem match\n`)
  if (unmatched.length > 0) {
    console.log('Atletas sem match (verificar nomes na BD):')
    for (const u of unmatched) console.log(`   "${u.nome}" (${u.turma})`)
    console.log()
  }

  // Carregar pagamentos existentes para idempotência. Para cotas pode haver
  // entradas em qualquer ano (data_pagamento pode ser 2025 para cota de Jan
  // 2026). Carregamos pagamentos cuja `mes_referencia` aponta para 2026 ou
  // que são seguros do ano.
  console.log('💰 A carregar pagamentos existentes do ano...')
  const { data: existingData } = await (admin.from('pagamentos') as any)
    .select('id, membro_id, tipo, mes_referencia, data_pagamento')
    .or(`mes_referencia.like.${YEAR}-%,and(tipo.eq.seguro,data_pagamento.gte.${YEAR}-01-01,data_pagamento.lte.${YEAR}-12-31)`)
  const existing = (existingData || []) as { id: string; membro_id: string; tipo: string; mes_referencia: string | null; data_pagamento: string }[]
  // Map de chaves → entrada (para detectar updates necessários)
  const existingKeys = new Set<string>()
  const existingByKey = new Map<string, { id: string; data_pagamento: string }>()
  for (const e of existing) {
    if (e.tipo === 'cota' && e.mes_referencia) {
      const k = `${e.membro_id}|cota|${e.mes_referencia}`
      existingKeys.add(k)
      existingByKey.set(k, { id: e.id, data_pagamento: e.data_pagamento })
    } else if (e.tipo === 'seguro') {
      const ano = new Date(e.data_pagamento).getFullYear()
      existingKeys.add(`${e.membro_id}|seguro|${ano}`)
    }
  }
  console.log(`   ${existing.length} pagamentos já existentes (cotas+seguros)\n`)

  // Construir lista de inserts/updates
  const insertsCotas: any[] = []
  const insertsSeguros: any[] = []
  const updatesCotas: { id: string; data_pagamento: string }[] = []
  const competidoresAutoUpdates: { membroId: string; nome: string }[] = []
  const cotaUpdates: { membroId: string; nome: string; cota: number }[] = []

  for (const { atleta, membro } of matched) {
    // Atualizar cota base se diferente
    if (atleta.cota !== null && atleta.cota !== Number(membro.cota)) {
      cotaUpdates.push({ membroId: membro.id, nome: membro.nome, cota: atleta.cota })
    }

    // Seguro
    if (atleta.seguro) {
      const key = `${membro.id}|seguro|${YEAR}`
      if (!existingKeys.has(key)) {
        const sm = parseInt(atleta.seguro.mes, 10)
        const sd = parseInt(atleta.seguro.dia, 10)
        const dataPag = safeDate(YEAR, sm, sd, sm)
        insertsSeguros.push({
          membro_id: membro.id,
          tipo: 'seguro',
          valor: atleta.seguro.valor,
          descricao: `Seguro ${YEAR} · ${atleta.seguro.metodo}`,
          data_pagamento: dataPag,
          admin_id: ADMIN_FALLBACK_ID,
        })
        existingKeys.add(key)
        // Regra: se valor=45 e atleta não é competidor, marcar como competidor
        if (atleta.seguro.valor === 45 && !membro.is_competicao) {
          competidoresAutoUpdates.push({ membroId: membro.id, nome: membro.nome })
        }
      }
    }

    // Cotas
    for (const c of atleta.cotas) {
      const mesRef = `${YEAR}-${String(c.mes).padStart(2, '0')}`
      // Calcular data_pagamento real:
      // - Se mesPagamento = 12 e mes_ref = 01, foi pago em Dez do ano anterior
      // - Caso contrário, usar (YEAR, mesPagamento, dia)
      let anoPagamento = YEAR
      if (c.mesPagamento === 12 && c.mes === 1) anoPagamento = YEAR - 1
      const dataPag = safeDate(anoPagamento, c.mesPagamento, c.dia, c.mes)

      const key = `${membro.id}|cota|${mesRef}`
      if (existingKeys.has(key)) {
        // Já existe — verificar se a data está correcta. Se diferente, marcar para UPDATE.
        const existing = existingByKey.get(key)
        if (existing && existing.data_pagamento.slice(0, 10) !== dataPag.slice(0, 10)) {
          updatesCotas.push({ id: existing.id, data_pagamento: dataPag })
        }
        continue
      }
      insertsCotas.push({
        membro_id: membro.id,
        tipo: 'cota',
        valor: c.valor,
        mes_referencia: mesRef,
        descricao: c.metodo,
        data_pagamento: dataPag,
        admin_id: ADMIN_FALLBACK_ID,
      })
      existingKeys.add(key)
    }
  }

  console.log('📊 RESUMO PROPOSTO')
  console.log(`   ✅ ${insertsCotas.length} cotas mensais a inserir`)
  console.log(`   🛡️  ${insertsSeguros.length} seguros a inserir`)
  console.log(`   📅 ${updatesCotas.length} cotas com data_pagamento a corrigir`)
  console.log(`   🏆 ${competidoresAutoUpdates.length} atletas a marcar como competidor (seguro 45€)`)
  console.log(`   ⚙️  ${cotaUpdates.length} ajustes de cota base em membros\n`)

  if (insertsSeguros.length > 0) {
    const totalSeg = insertsSeguros.reduce((s, x) => s + x.valor, 0)
    console.log(`💰 Total seguros: ${totalSeg}€`)
  }
  if (insertsCotas.length > 0) {
    const totalCot = insertsCotas.reduce((s, x) => s + x.valor, 0)
    console.log(`💰 Total cotas: ${totalCot}€\n`)
  }

  if (competidoresAutoUpdates.length > 0) {
    console.log('🏆 Atletas que vão ser marcados como competidor:')
    for (const c of competidoresAutoUpdates) console.log(`   ${c.nome}`)
    console.log()
  }

  if (cotaUpdates.length > 0) {
    console.log('⚙️  Ajustes de cota base (cota actual → cota do ODS):')
    for (const u of cotaUpdates.slice(0, 30)) console.log(`   ${u.nome.padEnd(35)} → ${u.cota}€`)
    if (cotaUpdates.length > 30) console.log(`   …e mais ${cotaUpdates.length - 30}`)
    console.log()
  }

  // Escrever CSVs de unmatched
  if (unmatched.length > 0) {
    writeCsv(
      'pagamentos-unmatched.csv',
      ['Atleta', 'Turma', 'Cota', 'Seguro', '#Cotas mensais'],
      unmatched.map(u => [u.nome, u.turma, String(u.cota ?? ''), u.seguro ? `${u.seguro.valor}€` : '', String(u.cotas.length)])
    )
    console.log(`📋 pagamentos-unmatched.csv escrito (${unmatched.length} linhas)`)
  }

  if (!apply) {
    console.log('\n🔒 Dry-run terminado. Adiciona --apply para executar.')
    return
  }

  // ─── EXECUTE ─────────────────────────────────────────────────────────
  console.log(`\n🚀 A aplicar...`)
  const errors: { kind: string; nome: string; reason: string }[] = []

  // 1. Inserir seguros (em chunks)
  if (insertsSeguros.length > 0) {
    const chunk = 50
    for (let i = 0; i < insertsSeguros.length; i += chunk) {
      const slice = insertsSeguros.slice(i, i + chunk)
      const { error } = await (admin.from('pagamentos') as any).insert(slice)
      if (error) {
        console.error(`✗ Insert seguros chunk ${i / chunk}: ${error.message}`)
        slice.forEach(s => errors.push({ kind: 'seguro', nome: s.membro_id, reason: error.message }))
      } else {
        console.log(`✓ Inseridos ${slice.length} seguros (lote ${i / chunk + 1})`)
      }
    }
  }

  // 2. Inserir cotas (em chunks)
  if (insertsCotas.length > 0) {
    const chunk = 100
    for (let i = 0; i < insertsCotas.length; i += chunk) {
      const slice = insertsCotas.slice(i, i + chunk)
      const { error } = await (admin.from('pagamentos') as any).insert(slice)
      if (error) {
        console.error(`✗ Insert cotas chunk ${i / chunk}: ${error.message}`)
        slice.forEach(s => errors.push({ kind: 'cota', nome: s.membro_id, reason: error.message }))
      } else {
        console.log(`✓ Inseridas ${slice.length} cotas (lote ${i / chunk + 1})`)
      }
    }
  }

  // 2b. Corrigir data_pagamento de cotas existentes
  if (updatesCotas.length > 0) {
    let okUpd = 0
    for (const u of updatesCotas) {
      const { error } = await (admin.from('pagamentos') as any)
        .update({ data_pagamento: u.data_pagamento })
        .eq('id', u.id)
      if (error) errors.push({ kind: 'update_data', nome: u.id, reason: error.message })
      else okUpd++
    }
    console.log(`✓ ${okUpd}/${updatesCotas.length} cotas com data_pagamento actualizada`)
  }

  // 3. Atualizar competidores
  for (const c of competidoresAutoUpdates) {
    const { error } = await (admin.from('membros') as any)
      .update({ is_competicao: true })
      .eq('id', c.membroId)
    if (error) errors.push({ kind: 'competicao', nome: c.nome, reason: error.message })
  }
  if (competidoresAutoUpdates.length > 0) {
    console.log(`✓ ${competidoresAutoUpdates.length} atletas marcados como competidor`)
  }

  // 4. Atualizar cotas base
  for (const u of cotaUpdates) {
    const { error } = await (admin.from('membros') as any)
      .update({ cota: u.cota })
      .eq('id', u.membroId)
    if (error) errors.push({ kind: 'cota_base', nome: u.nome, reason: error.message })
  }
  if (cotaUpdates.length > 0) {
    console.log(`✓ ${cotaUpdates.length} cotas base actualizadas em membros`)
  }

  // 5. Activity log
  await (admin.from('activity_log') as any).insert({
    admin_id: ADMIN_FALLBACK_ID,
    action: 'IMPORTAR_PAGAMENTOS_2026',
    description: `Importou ${insertsCotas.length} cotas + ${insertsSeguros.length} seguros (ano ${YEAR}) do ODS`,
    entity_type: 'pagamento',
  })

  console.log(`\n${'━'.repeat(60)}`)
  console.log(`✅ Cotas inseridas: ${insertsCotas.length - errors.filter(e => e.kind === 'cota').length}`)
  console.log(`✅ Seguros inseridos: ${insertsSeguros.length - errors.filter(e => e.kind === 'seguro').length}`)
  console.log(`❌ Erros: ${errors.length}`)
  console.log(`${'━'.repeat(60)}`)

  if (errors.length > 0) {
    writeCsv(
      'pagamentos-errors.csv',
      ['Tipo', 'Membro', 'Erro'],
      errors.map(e => [e.kind, e.nome, e.reason])
    )
    console.log(`📋 pagamentos-errors.csv escrito (${errors.length} linhas)`)
  }
}

main().catch(e => {
  console.error('\n❌ Erro inesperado:', e)
  process.exit(1)
})
