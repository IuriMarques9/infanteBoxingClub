'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { User, Calendar, X } from 'lucide-react'
import Chip from '@/components/shared/Chip'
import { getActivityLabel, formatRelativeTime } from '@/lib/activity-log-labels'

// ─── LINHA DE LOG CLICÁVEL COM DRAWER (D2) ─────────────────────
// Substitui a <tr> da página de logs para abrir um drawer lateral
// com todos os campos + metadata (jsonb) formatado.

export default function LogRow({ log }: { log: any }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const labelInfo = getActivityLabel(log.action)
  const Icon = labelInfo.icon
  const hasMetadata = log.metadata && typeof log.metadata === 'object' && Object.keys(log.metadata).length > 0

  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <tr
        className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
        onClick={() => setOpen(true)}
      >
        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col gap-0.5">
            <span className="text-white/80 text-xs sm:text-sm">{formatRelativeTime(log.created_at)}</span>
            <span className="text-white/30 text-[10px] hidden sm:inline">{new Date(log.created_at).toLocaleString('pt-PT')}</span>
          </div>
          <div className="text-white/40 text-[11px] mt-1 sm:hidden line-clamp-2">
            {log.description}
          </div>
        </td>
        <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-[#E8B55B]">
              <User className="w-3 h-3" />
            </div>
            <span className="text-white/80 font-medium">
              {log.profiles?.nome || log.profiles?.email?.split('@')[0] || 'Admin eliminado'}
            </span>
          </div>
        </td>
        <td className="px-3 sm:px-6 py-4">
          <Chip tone={labelInfo.tone} size="sm" title={`#${log.action}`} className="!normal-case">
            <Icon className="w-3 h-3" />
            {labelInfo.label}
          </Chip>
        </td>
        <td className="px-3 sm:px-6 py-4 text-white/40 hidden sm:table-cell">
          <div className="flex items-center justify-between gap-2">
            <span className="line-clamp-1">{log.description}</span>
            {hasMetadata && (
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E8B55B]/10 text-[#E8B55B] border border-[#E8B55B]/20 shrink-0">
                +info
              </span>
            )}
          </div>
        </td>
      </tr>

      {open && mounted && createPortal(
        (
            <div
              className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            >
              <div
                className="w-full max-w-md bg-[#0F0F0F] border-l border-[#E8B55B]/20 shadow-2xl overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-[#0F0F0F]/95 backdrop-blur border-b border-white/10 px-5 py-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Detalhe do evento</p>
                    <h3 className="text-[#E8B55B] font-headline text-lg tracking-wider mt-1 flex items-center gap-2">
                      <Icon className="w-5 h-5" /> {labelInfo.label}
                    </h3>
                    <p className="text-white/30 text-[10px] font-mono mt-0.5">#{log.action}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Fechar"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <dl className="p-5 space-y-4 text-sm">
                  <Field label="Data / Hora">
                    <span className="text-white/80 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#E8B55B]/60" />
                      {new Date(log.created_at).toLocaleString('pt-PT')}
                    </span>
                    <span className="text-white/40 text-xs">{formatRelativeTime(log.created_at)}</span>
                  </Field>
                  <Field label="Admin">
                    <span className="text-white/80">
                      {log.profiles?.nome
                        ? `${log.profiles.nome} (${log.profiles.email})`
                        : log.profiles?.email || 'Admin eliminado'}
                    </span>
                  </Field>
                  <Field label="Descrição">
                    <p className="text-white/80 leading-relaxed">{log.description || '(vazio)'}</p>
                  </Field>
                  <Field label="Entidade">
                    <span className="text-white/80">{log.entity_type || '—'}</span>
                  </Field>
                  {log.entity_id && (
                    <Field label="ID da Entidade">
                      <code className="text-white/70 text-[11px] font-mono break-all bg-black/30 px-2 py-1 rounded border border-white/5">
                        {log.entity_id}
                      </code>
                    </Field>
                  )}
                  <Field label="Metadata (JSON)">
                    {hasMetadata ? (
                      <pre className="text-[11px] text-emerald-300/80 bg-black/30 p-3 rounded-lg border border-white/5 overflow-x-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-white/30 text-xs italic">
                        Sem metadata estruturada. Aplica a migration <code className="font-mono">20260427_activity_log_metadata.sql</code> e atualiza as server actions para popular `metadata` (ex: diff antes/depois).
                      </p>
                    )}
                  </Field>
                </dl>
              </div>
            </div>
        ),
        document.body,
      )}
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</dt>
      <dd className="flex flex-col gap-1">{children}</dd>
    </div>
  )
}
