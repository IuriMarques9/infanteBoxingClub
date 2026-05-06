'use client'

import { useRef, useState, useTransition } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

// ─── IMAGE UPLOADER ───────────────────────────────────────────
// Dropzone reutilizável para imagens em formulários de dashboard.
// Guarda a URL pública no hidden input `name` e a URL anterior em
// `name_previous` para que a server action possa limpar o ficheiro
// antigo do Storage após uma substituição ou remoção.
//
// Formatos aceites: JPG, PNG, WEBP. Max 5 MB.
// Bucket alvo: `images` (público).

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ACCEPTED_ATTR  = ACCEPTED_TYPES.join(',')
const MAX_BYTES      = 5 * 1024 * 1024 // 5 MB

interface ImageUploaderProps {
  pathPrefix: string       // e.g. "eventos/", "produtos/"
  currentUrl?: string | null
  name: string             // name for hidden input in forms
  compact?: boolean        // shorter dropzone (h-32) instead of aspect-video
}

export default function ImageUploader({
  pathPrefix,
  currentUrl,
  name,
  compact = false,
}: ImageUploaderProps) {
  const inputRef                    = useRef<HTMLInputElement>(null)
  const [pending, start]            = useTransition()
  const [publicUrl, setPublicUrl]   = useState<string | null>(currentUrl ?? null)
  const [previousUrl, setPreviousUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  function validate(file: File): boolean {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Formato não suportado. Usa JPG, PNG ou WEBP.')
      return false
    }
    if (file.size > MAX_BYTES) {
      toast.error('Imagem demasiado grande (máx. 5 MB).')
      return false
    }
    return true
  }

  function processFile(file: File) {
    if (!validate(file)) return

    // Immediate preview while upload is in flight
    const objectUrl = URL.createObjectURL(file)
    setPreviousUrl(publicUrl)
    setPublicUrl(objectUrl)

    start(async () => {
      const supabase = createClient()
      const path     = `${pathPrefix}${Date.now()}_${file.name}`

      const { error } = await supabase.storage.from('images').upload(path, file)
      if (error) {
        toast.error(`Erro ao fazer upload: ${error.message}`)
        // Roll back preview to what was there before
        setPublicUrl(previousUrl)
        setPreviousUrl(null)
        return
      }

      const { data: { publicUrl: uploadedUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(path)

      setPublicUrl(uploadedUrl)
      toast.success('Imagem carregada com sucesso.')
      if (inputRef.current) inputRef.current.value = ''
    })
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleRemove() {
    setPreviousUrl(publicUrl)
    setPublicUrl(null)
  }

  const borderColor = isDragging
    ? 'border-[#E8B55B]/50'
    : 'border-white/20 hover:border-[#E8B55B]/50'

  return (
    <div className="relative w-full">
      {/* Hidden inputs for form integration */}
      <input type="hidden" name={name}               value={publicUrl   ?? ''} />
      <input type="hidden" name={`${name}_previous`} value={previousUrl ?? ''} />

      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Área de upload de imagem"
        onClick={() => !pending && inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={[
          'relative w-full rounded-xl overflow-hidden cursor-pointer',
          compact ? 'h-32' : 'aspect-video',
          'border-2 border-dashed transition-colors',
          borderColor,
          'bg-[#1A1A1A]',
          pending ? 'opacity-60 cursor-not-allowed' : '',
        ].join(' ')}
      >
        {publicUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={publicUrl}
            alt="Pré-visualização"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <ImagePlus className="w-8 h-8 text-white/50" />
            <p className="text-sm text-white/50 select-none">
              Arrasta ou clica para carregar
            </p>
            <p className="text-xs text-white/30 select-none">
              JPG, PNG, WEBP — máx. 5 MB
            </p>
          </div>
        )}

        {/* Hover / pending overlay */}
        <span className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all pointer-events-none">
          {pending ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <ImagePlus className="w-8 h-8 text-white" />
          )}
        </span>
      </div>

      {/* Remove button — only shown when there is an image and no upload in progress */}
      {publicUrl && !pending && (
        <button
          type="button"
          onClick={handleRemove}
          aria-label="Remover imagem"
          className="absolute top-2 right-2 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 hover:border-white/50 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_ATTR}
        onChange={handleInputChange}
        className="hidden"
        disabled={pending}
      />
    </div>
  )
}
