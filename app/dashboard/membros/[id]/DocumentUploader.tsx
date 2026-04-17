'use client'

import { createClient } from '@/lib/supabase/client'
import { Upload, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ─── COMPONENTE DE UPLOAD DE DOCUMENTOS ────────────────────────
// Permite ao administrador enviar ficheiros (CC, Ficha Médica, etc.)
// para o Bucket "documentos" do Supabase, na pasta do membro.
// Os ficheiros ficam protegidos por RLS (apenas admins autenticados acedem).
export default function DocumentUploader({ membroId }: { membroId: string }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Nomear o ficheiro de forma única para evitar conflitos
      const fileName = `${Date.now()}_${file.name}`
      const filePath = `membros/${membroId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Refresh da página para mostrar o novo documento na lista
      router.refresh()
    } catch (err: any) {
      console.error('Erro no upload:', err)
      setError(err.message || 'Erro ao enviar ficheiro.')
    } finally {
      setUploading(false)
      // Limpar o input de ficheiro
      e.target.value = ''
    }
  }

  return (
    <div>
      <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border-2 border-dashed border-white/10 hover:border-[#E8B55B]/30 text-white/50 hover:text-[#E8B55B] cursor-pointer transition-all text-sm font-medium">
        {uploading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> A enviar...</>
        ) : (
          <><Upload className="w-4 h-4" /> Enviar Documento</>
        )}
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
      </label>
      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  )
}
