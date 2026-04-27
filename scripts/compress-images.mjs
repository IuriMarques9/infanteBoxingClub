// Script de compressão de imagens — corre 1x quando as fotos originais
// estão pesadas. Resize máximo 1920px de largura + recompressão PNG
// (palette mode 8-bit + qualidade 90). Backup .original.png ao lado.
//
// Uso: `node scripts/compress-images.mjs`
//
// O Next.js serve automaticamente em AVIF/WebP em produção, mas o
// PNG original ainda é o que pesa no repo + cache CDN. Reduzir o
// original é o que mais impacto tem.

import sharp from 'sharp'
import { readdir, stat, rename, copyFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = join(__dirname, '..', 'public')
// Comprime ficheiros >= 1MB
const SIZE_THRESHOLD_BYTES = 1 * 1024 * 1024
const MAX_WIDTH = 1920

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

async function compressOne(filename) {
  const path = join(PUBLIC_DIR, filename)
  const sBefore = await stat(path)
  if (sBefore.size < SIZE_THRESHOLD_BYTES) return null

  const ext = filename.split('.').pop().toLowerCase()
  if (!['png', 'jpg', 'jpeg'].includes(ext)) return null

  // Backup do original — só na primeira vez (.original.<ext>)
  const backupPath = path.replace(/\.(png|jpg|jpeg)$/i, `.original.${ext}`)
  try {
    await stat(backupPath)
  } catch {
    await copyFile(path, backupPath)
  }

  const meta = await sharp(backupPath).metadata()
  const targetWidth = meta.width && meta.width > MAX_WIDTH ? MAX_WIDTH : meta.width

  const tmpPath = path + '.tmp'
  let pipeline = sharp(backupPath).resize({ width: targetWidth, withoutEnlargement: true })

  if (ext === 'png') {
    pipeline = pipeline.png({ palette: true, quality: 90, compressionLevel: 9, effort: 10 })
  } else {
    pipeline = pipeline.jpeg({ quality: 82, progressive: true, mozjpeg: true })
  }

  await pipeline.toFile(tmpPath)
  await rename(tmpPath, path)
  const sAfter = await stat(path)

  return {
    filename,
    width: meta.width,
    targetWidth,
    before: sBefore.size,
    after: sAfter.size,
    ratio: ((1 - sAfter.size / sBefore.size) * 100).toFixed(1),
  }
}

async function main() {
  const files = await readdir(PUBLIC_DIR)
  const results = []
  for (const f of files) {
    try {
      const r = await compressOne(f)
      if (r) results.push(r)
    } catch (err) {
      console.error(`✗ ${f}: ${err.message}`)
    }
  }
  if (results.length === 0) {
    console.log('Nada a comprimir (ou todos abaixo do threshold).')
    return
  }
  console.log('\nResultado:')
  console.log('┌──────────────────────────────┬──────────────┬──────────────┬───────────┐')
  console.log('│ Ficheiro                     │ Antes        │ Depois       │ Poupança  │')
  console.log('├──────────────────────────────┼──────────────┼──────────────┼───────────┤')
  let totalBefore = 0, totalAfter = 0
  for (const r of results) {
    totalBefore += r.before
    totalAfter += r.after
    console.log(
      `│ ${r.filename.padEnd(28)} │ ${fmt(r.before).padStart(12)} │ ${fmt(r.after).padStart(12)} │ ${(r.ratio + '%').padStart(9)} │`,
    )
  }
  console.log('├──────────────────────────────┼──────────────┼──────────────┼───────────┤')
  const totalRatio = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
  console.log(
    `│ TOTAL                        │ ${fmt(totalBefore).padStart(12)} │ ${fmt(totalAfter).padStart(12)} │ ${(totalRatio + '%').padStart(9)} │`,
  )
  console.log('└──────────────────────────────┴──────────────┴──────────────┴───────────┘')
}

main().catch(err => { console.error(err); process.exit(1) })
