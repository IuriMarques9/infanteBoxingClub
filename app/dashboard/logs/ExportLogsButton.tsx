'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { exportLogsCSV, type LogsExportFilters } from './actions'

// ─── BOTÃO DE EXPORTAR LOGS EM CSV ─────────────────────────────
// Recebe os filtros atuais (já lidos pela page.tsx no server) e
// dispara um download client-side via Blob. Inclui BOM UTF-8 para
// abrir corretamente em Excel.
export default function ExportLogsButton({ filters }: { filters: LogsExportFilters }) {
  const [busy, setBusy] = useState(false)

  async function onClick() {
    setBusy(true)
    try {
      const csv = await exportLogsCSV(filters)
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `logs_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('CSV de logs exportado')
    } catch (e: any) {
      toast.error(e?.message || 'Falha ao exportar')
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
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {busy ? 'A exportar…' : 'Exportar CSV'}
    </button>
  )
}
