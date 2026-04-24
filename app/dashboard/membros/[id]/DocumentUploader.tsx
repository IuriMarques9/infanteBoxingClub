'use client'

import { useState, useTransition } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { uploadDocument } from './documents-actions'

// ─── COMPONENTE DE UPLOAD DE DOCUMENTOS ────────────────────────
// Envia ficheiros via Server Action com metadata (categoria, tamanho, MIME).
// A categoria tem de ser escolhida antes do upload para alimentar o chip no card.

const CATEGORIAS = [
  { value: 'declaracao', label: '📄 Declaração dos Pais' },
  { value: 'seguro', label: '🛡️ Comprovativo de Seguro' },
  { value: 'inspecao_medica', label: '🏥 Inspeção Médica' },
  { value: 'outro', label: '📎 Outro' },
]

export default function DocumentUploader({ membroId }: { membroId: string }) {
  const [categoria, setCategoria] = useState('declaracao')
  const [error, setError] = useState<string | null>(null)
  const [isPending, start] = useTransition()
  const router = useRouter()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('membro_id', membroId)
    fd.append('categoria', categoria)
    fd.append('file', file)
    setError(null)
    const target = e.target
    start(async () => {
      const res = await uploadDocument(fd)
      if (res && 'error' in res && res.error) {
        setError(res.error)
      } else {
        router.refresh()
      }
      target.value = ''
    })
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Categoria</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          disabled={isPending}
          className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm appearance-none"
        >
          {CATEGORIAS.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
      <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border-2 border-dashed border-white/10 hover:border-[#E8B55B]/30 text-white/50 hover:text-[#E8B55B] cursor-pointer transition-all text-sm font-medium">
        {isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> A enviar...</>
        ) : (
          <><Upload className="w-4 h-4" /> Enviar Documento</>
        )}
        <input
          type="file"
          onChange={handleFile}
          disabled={isPending}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
      </label>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
