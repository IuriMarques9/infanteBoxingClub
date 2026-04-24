'use client'

import { Download } from 'lucide-react'
import { useState } from 'react'
import { exportPagamentosCSV } from '@/app/dashboard/pagamentos/actions'

// ─── BOTÃO DE EXPORTAR CSV ──────────────────────────────────────
// Client component. Ao clicar, chama a server action, recebe o CSV
// como string e dispara o download através de um Blob.
export default function ExportCSVButton({
  from,
  to,
  membroId,
  label = 'Exportar CSV',
}: {
  from: string
  to: string
  membroId?: string
  label?: string
}) {
  const [busy, setBusy] = useState(false)

  async function onClick() {
    setBusy(true)
    try {
      const csv = await exportPagamentosCSV({ from, to, membroId })
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pagamentos_${from}_${to}${membroId ? `_${membroId.slice(0, 8)}` : ''}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#E8B55B] bg-[#E8B55B]/10 border border-[#E8B55B]/20 hover:bg-[#E8B55B]/20 transition-all disabled:opacity-50"
    >
      <Download className="w-4 h-4" /> {busy ? 'A exportar...' : label}
    </button>
  )
}
