'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getDocumentSignedUrl } from '@/app/dashboard/membros/[id]/documents-actions'

// ─── MODAL DE PRÉ-VISUALIZAÇÃO DE DOCUMENTOS ──────────────────
// Busca uma URL assinada de 60s ao abrir e mostra PDF/imagem in-app.

interface DocumentPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  storagePath: string
  fileName: string
  mimeType: string | null
}

export default function DocumentPreviewModal({
  open,
  onOpenChange,
  storagePath,
  fileName,
  mimeType,
}: DocumentPreviewModalProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setUrl(null)
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    getDocumentSignedUrl(storagePath).then((res) => {
      if (cancelled) return
      if ('error' in res && res.error) {
        setError(res.error)
      } else if ('url' in res && res.url) {
        setUrl(res.url)
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [open, storagePath])

  const isImage = !!mimeType && mimeType.startsWith('image/')
  const isPdf = mimeType === 'application/pdf'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#121212] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white truncate pr-8">{fileName}</DialogTitle>
        </DialogHeader>
        <div className="min-h-[40vh] flex items-center justify-center">
          {loading && (
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> A preparar pré-visualização...
            </div>
          )}
          {error && !loading && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          {url && !loading && !error && (
            <>
              {isImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={fileName}
                  className="max-h-[70vh] w-auto mx-auto rounded-lg"
                />
              )}
              {isPdf && (
                <iframe
                  src={url}
                  title={fileName}
                  className="w-full h-[70vh] rounded-lg bg-white"
                />
              )}
              {!isImage && !isPdf && (
                <p className="text-white/60 text-sm">
                  Preview não disponível. Usa o botão de download.
                </p>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
