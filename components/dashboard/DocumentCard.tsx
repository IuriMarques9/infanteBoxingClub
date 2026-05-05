'use client'

import { useState, useTransition } from 'react'
import { Download, Eye, Trash2, Loader2, FileText } from 'lucide-react'
import Chip from '@/components/shared/Chip'
import DocumentPreviewModal from './DocumentPreviewModal'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import {
  deleteDocument,
  getDocumentSignedUrl,
} from '@/app/dashboard/membros/[id]/documents-actions'

// ─── CARD DE DOCUMENTO ─────────────────────────────────────────
// Linha única com chip de categoria, nome/meta e acções:
// download (URL assinada), preview (modal) e delete (com confirmação).

type CategoriaKey =
  | 'cc'
  | 'declaracao'
  | 'inspecao_medica'
  | 'seguro'
  | 'autorizacao'
  | 'contrato'
  | 'outro'

const categoriaTone: Record<CategoriaKey, 'gold' | 'blue' | 'green' | 'red' | 'purple' | 'neutral'> = {
  cc: 'gold',
  declaracao: 'neutral',
  inspecao_medica: 'blue',
  seguro: 'green',
  autorizacao: 'purple',
  contrato: 'red',
  outro: 'neutral',
}

const categoriaLabel: Record<CategoriaKey, string> = {
  cc: 'Identificação',
  declaracao: 'Declaração',
  inspecao_medica: 'Inspeção Médica',
  seguro: 'Seguro',
  autorizacao: 'Autorização',
  contrato: 'Contrato',
  outro: 'Outro',
}

function formatSize(bytes: number | null | undefined) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface DocumentCardProps {
  id: string
  fileName: string
  categoria: string
  uploadedAt: string
  sizeBytes: number | null
  mimeType: string | null
  storagePath: string
}

export default function DocumentCard({
  id,
  fileName,
  categoria,
  uploadedAt,
  sizeBytes,
  mimeType,
  storagePath,
}: DocumentCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [downloading, startDownload] = useTransition()
  const [deleting, startDelete] = useTransition()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    startDelete(async () => {
      const fd = new FormData()
      fd.append('id', id)
      await deleteDocument(fd)
      setConfirmOpen(false)
    })
  }

  const key = (categoriaLabel[categoria as CategoriaKey] ? (categoria as CategoriaKey) : 'outro')
  const tone = categoriaTone[key]
  const label = categoriaLabel[key]

  function handleDownload() {
    setError(null)
    startDownload(async () => {
      const res = await getDocumentSignedUrl(storagePath)
      if ('error' in res && res.error) {
        setError(res.error)
        return
      }
      if ('url' in res) {
        window.open(res.url, '_blank', 'noopener,noreferrer')
      }
    })
  }

  const meta = [
    formatSize(sizeBytes),
    uploadedAt ? new Date(uploadedAt).toLocaleDateString('pt-PT') : '',
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
        <div className="shrink-0">
          <Chip tone={tone}>{label}</Chip>
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <FileText className="w-4 h-4 text-white/40 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm text-white/80 truncate">{fileName}</p>
            {meta && <p className="text-[11px] text-white/30">{meta}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            title="Pré-visualizar"
            className="p-2 rounded-lg text-white/40 hover:text-[#E8B55B] hover:bg-white/5 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            title="Download"
            className="p-2 rounded-lg text-white/40 hover:text-[#E8B55B] hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
            title="Eliminar"
            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 text-xs mt-1 pl-3">{error}</p>}
      <DocumentPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        storagePath={storagePath}
        fileName={fileName}
        mimeType={mimeType}
      />
      <ConfirmDeleteDialog
        open={confirmOpen}
        onOpenChange={(o) => { if (!deleting) setConfirmOpen(o) }}
        title={`Eliminar "${fileName}"?`}
        description="O ficheiro é removido do storage e da base de dados. Esta acção não pode ser revertida."
        confirmLabel={deleting ? 'A eliminar…' : 'Eliminar'}
        onConfirm={handleDelete}
      />
    </>
  )
}
