// Script de import bulk de documentos de atletas a partir de XLSX (ClickUp).
//
// Uso:
//   npx tsx scripts/importar-documentos.ts <ficheiro.xlsx>             # dry-run (default)
//   npx tsx scripts/importar-documentos.ts <ficheiro.xlsx> --apply     # executa de facto
//   npx tsx scripts/importar-documentos.ts <ficheiro.xlsx> --default-categoria=outro
//
// Lê NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY do .env.local.
// Gera skipped.csv (linhas que não bateram com membros) e errors.csv (falhas
// de download/upload). Não duplica entradas existentes graças ao Date.now()
// no storage_path + UNIQUE constraint na BD.

import { config as loadEnv } from 'dotenv'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'

// Carrega .env.local (não o .env por defeito do dotenv/config)
loadEnv({ path: '.env.local' })

// ─── ARGS ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const xlsxPath = args.find(a => !a.startsWith('--'))
const apply = args.includes('--apply')
const defaultCatArg = args.find(a => a.startsWith('--default-categoria='))?.split('=')[1]

if (!xlsxPath) {
  console.error('Uso: npx tsx scripts/importar-documentos.ts <ficheiro.xlsx> [--apply] [--default-categoria=outro]')
  process.exit(1)
}

const VALID_CATEGORIAS = ['cc', 'declaracao', 'inspecao_medica', 'seguro', 'autorizacao', 'contrato', 'avatar', 'outro'] as const
type Categoria = typeof VALID_CATEGORIAS[number]

const defaultCategoria: Categoria =
  defaultCatArg && (VALID_CATEGORIAS as readonly string[]).includes(defaultCatArg)
    ? (defaultCatArg as Categoria)
    : 'outro'

// ─── HELPERS ──────────────────────────────────────────────────────────
function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

function guessCategoria(fileName: string): Categoria {
  const s = normalize(fileName)
  if (/\bbi\b|\bcc\b|cidada/.test(s))     return 'cc'
  if (/foto|photo|perfil|avatar/.test(s)) return 'avatar'
  if (/declarac/.test(s))                 return 'declaracao'
  if (/inspec|medic|aptid/.test(s))       return 'inspecao_medica'
  if (/seguro/.test(s))                   return 'seguro'
  if (/autoriz/.test(s))                  return 'autorizacao'
  if (/contrat/.test(s))                  return 'contrato'
  return defaultCategoria
}

function safeName(s: string): string {
  return s.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || 'documento'
}

function csvEscape(s: any): string {
  const v = String(s ?? '')
  return `"${v.replace(/"/g, '""')}"`
}

function writeCsv(path: string, header: string[], rows: string[][]) {
  const lines = [header.map(csvEscape).join(','), ...rows.map(r => r.map(csvEscape).join(','))]
  writeFileSync(path, lines.join('\n'), 'utf8')
}

// ─── SUPABASE CLIENT (service role) ───────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !serviceKey) {
  console.error('❌ Faltam NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local')
  process.exit(1)
}
const admin = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// Resolve uploaded_by — service role não tem auth.uid(), o default da
// coluna avalia para NULL e o INSERT em document_metadata falha. Buscamos
// o ID do super-admin (SUPER_ADMIN_EMAIL no .env.local) e passamo-lo
// explicitamente em cada insert.
async function resolveUploadedBy(): Promise<string> {
  const email = process.env.SUPER_ADMIN_EMAIL
  if (!email) {
    console.error('❌ SUPER_ADMIN_EMAIL em falta no .env.local — necessário para preencher uploaded_by')
    process.exit(1)
  }
  const { data, error } = await admin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()
  if (error || !data?.id) {
    console.error(`❌ Não encontrei profile para ${email}:`, error?.message)
    process.exit(1)
  }
  return data.id as string
}

// ─── TIPOS DAS LINHAS DO XLSX ─────────────────────────────────────────
interface XlsxRow {
  Membro: string
  Documento: string
  Link: string
}

interface ReadyItem {
  membroId: string
  membroNome: string
  row: XlsxRow
  categoria: Categoria
}

// ─── FLOW ─────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${'━'.repeat(60)}`)
  console.log(`📥 IMPORT DE DOCUMENTOS — ${apply ? 'MODO REAL' : 'DRY-RUN'}`)
  console.log(`${'━'.repeat(60)}\n`)

  // 1. Carregar XLSX
  const absPath = resolve(xlsxPath!)
  console.log(`📄 A ler: ${absPath}`)
  const wb = XLSX.read(readFileSync(absPath))
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<XlsxRow>(ws, { defval: '' })
  console.log(`   ${rows.length} linhas (sheet: "${wb.SheetNames[0]}")\n`)

  // 2. Carregar membros da BD
  console.log('👥 A carregar membros da BD...')
  const { data: membros, error: membrosErr } = await admin
    .from('membros')
    .select('id, nome')
  if (membrosErr || !membros) {
    console.error('❌ Falha a ler membros:', membrosErr?.message)
    process.exit(1)
  }
  console.log(`   ${membros.length} membros encontrados\n`)

  const byNorm = new Map<string, { id: string; nome: string }[]>()
  membros.forEach(m => {
    const k = normalize(m.nome)
    const list = byNorm.get(k) ?? []
    list.push(m)
    byNorm.set(k, list)
  })

  // 3. Match + classificação
  const ready: ReadyItem[] = []
  const skipped: { row: XlsxRow; reason: string }[] = []

  for (const row of rows) {
    if (!row.Link?.toString().trim() || !row.Membro?.toString().trim()) {
      skipped.push({ row, reason: 'Linha incompleta (sem Membro ou Link)' })
      continue
    }
    const matches = byNorm.get(normalize(row.Membro)) ?? []
    if (matches.length === 0) {
      skipped.push({ row, reason: 'Membro não encontrado na BD' })
      continue
    }
    if (matches.length > 1) {
      skipped.push({ row, reason: `Ambíguo: ${matches.length} membros com este nome` })
      continue
    }
    ready.push({
      membroId: matches[0].id,
      membroNome: matches[0].nome,
      row,
      categoria: guessCategoria(row.Documento || ''),
    })
  }

  // 4. Resumo
  console.log('📊 RESUMO DA ANÁLISE')
  console.log(`   ✅ ${ready.length} prontos para importar`)
  console.log(`   ⚠️  ${skipped.length} saltados\n`)

  const byCat: Record<string, number> = {}
  ready.forEach(r => { byCat[r.categoria] = (byCat[r.categoria] ?? 0) + 1 })
  if (ready.length > 0) {
    console.log('📁 Distribuição por categoria (heurística):')
    Object.entries(byCat)
      .sort((a, b) => b[1] - a[1])
      .forEach(([c, n]) => console.log(`   ${c.padEnd(20)} ${n}`))
    console.log()
  }

  // Distribuição por motivo de salto
  if (skipped.length > 0) {
    const byReason: Record<string, number> = {}
    skipped.forEach(s => { byReason[s.reason] = (byReason[s.reason] ?? 0) + 1 })
    console.log('⚠️  Motivos de salto:')
    Object.entries(byReason)
      .sort((a, b) => b[1] - a[1])
      .forEach(([r, n]) => console.log(`   ${n.toString().padStart(4)}× ${r}`))
    console.log()

    writeCsv(
      'skipped.csv',
      ['Membro', 'Documento', 'Link', 'Razão'],
      skipped.map(s => [s.row.Membro, s.row.Documento, s.row.Link, s.reason]),
    )
    console.log(`📋 ${skipped.length} linhas escritas em skipped.csv\n`)
  }

  // 5. Sair se dry-run
  if (!apply) {
    console.log('🔒 Dry-run terminado. Nada foi alterado na BD.')
    console.log('   Adiciona --apply para executar de facto.\n')
    return
  }

  if (ready.length === 0) {
    console.log('Nada para importar.\n')
    return
  }

  // 6. Importar (sequencial — evita rate-limits do ClickUp e do Supabase)
  const uploadedBy = await resolveUploadedBy()
  console.log(`🚀 A importar ${ready.length} documentos (sequencial)...`)
  console.log(`   uploaded_by: ${uploadedBy}\n`)

  const errors: { item: ReadyItem; reason: string }[] = []
  const t0 = Date.now()

  for (let i = 0; i < ready.length; i++) {
    const item = ready[i]
    const tag = `[${(i + 1).toString().padStart(3)}/${ready.length}] ${item.membroNome} / ${item.row.Documento}`

    try {
      // Download do URL
      const res = await fetch(item.row.Link, { signal: AbortSignal.timeout(30_000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const arrayBuffer = await res.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      if (bytes.byteLength === 0) throw new Error('Ficheiro vazio')
      if (bytes.byteLength > 50 * 1024 * 1024) throw new Error('Ficheiro > 50 MB')

      const mime = res.headers.get('content-type') || 'application/octet-stream'
      const path = `membros/${item.membroId}/${Date.now()}_${safeName(item.row.Documento)}`

      // Upload ao bucket
      const { error: upErr } = await admin.storage
        .from('documentos')
        .upload(path, bytes, { contentType: mime, upsert: false })
      if (upErr) throw new Error(`Storage: ${upErr.message}`)

      // Insert metadata
      const { error: metaErr } = await admin.from('document_metadata').insert({
        membro_id: item.membroId,
        storage_path: path,
        file_name: item.row.Documento.slice(0, 250) || 'documento',
        categoria: item.categoria,
        mime_type: mime,
        size_bytes: bytes.byteLength,
        uploaded_by: uploadedBy,
      })
      if (metaErr) {
        // Rollback: remove o ficheiro do storage para não ficar órfão
        await admin.storage.from('documentos').remove([path])
        throw new Error(`Metadata: ${metaErr.message}`)
      }

      // Log de auditoria — admin_id explícito (service role não tem auth.uid())
      await admin.from('activity_log').insert({
        admin_id: uploadedBy,
        action: 'UPLOAD_DOCUMENTO',
        description: `Importou "${item.row.Documento}" (categoria: ${item.categoria})`,
        entity_type: 'membro',
        entity_id: item.membroId,
      })

      console.log(`✓ ${tag} (${(bytes.byteLength / 1024).toFixed(0)} KB)`)
    } catch (e: any) {
      console.log(`✗ ${tag} — ${e.message}`)
      errors.push({ item, reason: e.message })
    }
  }

  // 7. Resumo final
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
  console.log(`\n${'━'.repeat(60)}`)
  console.log(`✅ ${ready.length - errors.length} importados`)
  console.log(`⚠️  ${skipped.length} saltados (ver skipped.csv)`)
  console.log(`❌ ${errors.length} falhados`)
  console.log(`⏱️  ${elapsed}s`)
  console.log(`${'━'.repeat(60)}\n`)

  if (errors.length > 0) {
    writeCsv(
      'errors.csv',
      ['Membro', 'Documento', 'Link', 'Erro'],
      errors.map(e => [e.item.row.Membro, e.item.row.Documento, e.item.row.Link, e.reason]),
    )
    console.log(`📋 errors.csv escrito (${errors.length} falhas)`)
  }
}

main().catch(e => {
  console.error('\n❌ Erro inesperado:', e)
  process.exit(1)
})
