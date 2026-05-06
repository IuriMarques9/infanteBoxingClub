'use client'

import { useRef, useState, useTransition } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { uploadDocument } from './documents-actions'

// ─── UPLOAD DE AVATAR (B6) ────────────────────────────────────
// Mostra o avatar actual (ou iniciais) e permite trocar a foto.
// Reutiliza `uploadDocument` com `categoria=avatar` (bucket
// `documentos` partilhado). A lista de membros continua a usar
// iniciais — gerar signed URLs em massa para cada linha sai caro.
//
// Formatos aceites: JPG, PNG, WEBP. HEIC fica de fora porque
// browsers não-Apple não o renderizam nativamente; SVG fica de
// fora por risco de XSS (scripts dentro do SVG).

const ACCEPTED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ACCEPTED_AVATAR_ATTR = ACCEPTED_AVATAR_TYPES.join(',')

export default function AvatarUploader({
  membroId,
  nome,
  currentUrl,
}: {
  membroId: string
  nome: string
  currentUrl?: string | null
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [pending, start] = useTransition()
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null)
  const router = useRouter()

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      toast.error('Formato não suportado. Usa JPG, PNG ou WEBP.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem demasiado grande (máx. 5MB).')
      return
    }
    // Preview imediato
    setPreviewUrl(URL.createObjectURL(file))

    const fd = new FormData()
    fd.append('membro_id', membroId)
    fd.append('categoria', 'avatar')
    fd.append('file', file)
    start(async () => {
      const res = await uploadDocument(fd)
      if (res && 'error' in res && res.error) {
        toast.error(res.error)
        setPreviewUrl(currentUrl ?? null)
      } else {
        toast.success('Avatar atualizado')
        router.refresh()
      }
      if (inputRef.current) inputRef.current.value = ''
    })
  }

  return (
    <div className="relative inline-flex group">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={pending}
        aria-label="Mudar avatar"
        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#E8B55B]/30 bg-[#E8B55B]/10 flex items-center justify-center transition-all hover:border-[#E8B55B] disabled:opacity-60"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={`Avatar de ${nome}`} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl sm:text-4xl font-headline font-bold text-[#E8B55B]">
            {nome.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          {pending ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_AVATAR_ATTR}
        onChange={handleFile}
        className="hidden"
        disabled={pending}
      />
    </div>
  )
}
