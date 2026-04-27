'use client'

import { useRef, useState, useTransition } from 'react'
import { Upload, Loader2, FileCheck2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { uploadDocument } from './documents-actions'

// ─── COMPONENTE DE UPLOAD DE DOCUMENTOS ────────────────────────
// Envia ficheiros via Server Action com metadata (categoria, tamanho, MIME).
// A categoria tem de ser escolhida antes do upload para alimentar o chip no card.
// Suporta drag-and-drop e mostra feedback do ficheiro a ser enviado.

const CATEGORIAS = [
  { value: 'declaracao', label: '📄 Declaração dos Pais' },
  { value: 'seguro', label: '🛡️ Comprovativo de Seguro' },
  { value: 'inspecao_medica', label: '🏥 Inspeção Médica' },
  { value: 'outro', label: '📎 Outro' },
]

const ACCEPTED = '.pdf,.jpg,.jpeg,.png,.doc,.docx'

export default function DocumentUploader({ membroId }: { membroId: string }) {
  const [categoria, setCategoria] = useState('declaracao')
  const [error, setError] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isPending, start] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function uploadFile(file: File) {
    const fd = new FormData()
    fd.append('membro_id', membroId)
    fd.append('categoria', categoria)
    fd.append('file', file)
    setError(null)
    setPendingFile(file.name)
    start(async () => {
      const res = await uploadDocument(fd)
      if (res && 'error' in res && res.error) {
        setError(res.error)
        toast.error(res.error)
      } else {
        router.refresh()
        toast.success(`${file.name} enviado`)
      }
      setPendingFile(null)
      if (inputRef.current) inputRef.current.value = ''
    })
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    uploadFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setIsDragging(false)
    if (isPending) return
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    uploadFile(file)
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Categoria</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          disabled={isPending}
          className="w-full px-4 py-3 sm:py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-base sm:text-sm appearance-none"
        >
          {CATEGORIAS.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
      <label
        onDragOver={(e) => { e.preventDefault(); if (!isPending) setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={[
          'flex flex-col sm:flex-row items-center justify-center gap-2 w-full py-4 sm:py-3 px-4 rounded-xl bg-white/5 border-2 border-dashed text-sm font-medium cursor-pointer transition-all min-h-[56px]',
          isDragging
            ? 'border-[#E8B55B] text-[#E8B55B] bg-[#E8B55B]/5'
            : 'border-white/10 text-white/50 hover:border-[#E8B55B]/30 hover:text-[#E8B55B]',
          isPending ? 'opacity-70 cursor-wait' : '',
        ].join(' ')}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span className="truncate max-w-[220px]">A enviar {pendingFile ?? 'ficheiro'}…</span>
          </>
        ) : pendingFile ? (
          <>
            <FileCheck2 className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-[220px]">{pendingFile}</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 shrink-0" />
            <span className="text-center">
              <span className="hidden sm:inline">Arrasta um ficheiro ou </span>
              <span className="sm:hidden">Toca para </span>
              <span className="underline-offset-2">enviar documento</span>
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          onChange={handleFile}
          disabled={isPending}
          className="hidden"
          accept={ACCEPTED}
        />
      </label>
      <p className="text-[10px] text-white/30 uppercase tracking-wider">
        PDF, JPG, PNG, DOC · máx. 10MB
      </p>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
