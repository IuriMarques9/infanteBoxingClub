'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit } from 'lucide-react'
import { criarEvento, editarEvento } from './actions'
import ImageUploader from '@/components/dashboard/ImageUploader'
import { SubmitPrimary } from '@/components/dashboard/FormButtons'

interface Props {
  evento?: {
    id: string
    title: string
    description: string | null
    date: string
    date_end: string | null
    all_day: boolean
    location: string | null
    imageurl: string | null
    cta_url: string | null
  } | null
  trigger?: ReactNode
}

export default function EditEventoModal({ evento, trigger }: Props) {
  const [open, setOpen] = useState(false)
  const [allDay, setAllDay] = useState(evento?.all_day ?? false)
  const isEdit = !!evento

  // Formato esperado pelo input: "YYYY-MM-DDTHH:MM" (datetime-local)
  // ou "YYYY-MM-DD" (date — quando all_day).
  const toLocalDatetime = (iso: string) => {
    const d = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
  const toLocalDate = (iso: string) => toLocalDatetime(iso).slice(0, 10)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button className="p-2 text-white/20 hover:text-[#E8B55B] transition-colors">
            <Edit className="w-4 h-4" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#121212] border border-white/10 text-white max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#E8B55B] font-headline tracking-wider">
            {isEdit ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
        </DialogHeader>
        <form
          action={isEdit ? editarEvento : criarEvento}
          className="space-y-3"
        >
          {isEdit && <input type="hidden" name="id" value={evento.id} />}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Título <span className="text-[#E8B55B]/70">*</span>
            </label>
            <input name="title" defaultValue={evento?.title} required
              className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Descrição <span className="text-[#E8B55B]/70">*</span>
            </label>
            <textarea name="description" defaultValue={evento?.description ?? ''} required rows={3}
              className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                Início <span className="text-[#E8B55B]/70">*</span>
              </label>
              <input
                key={allDay ? 'date-start' : 'datetime-start'}
                name="date"
                type={allDay ? 'date' : 'datetime-local'}
                defaultValue={
                  evento?.date
                    ? (allDay ? toLocalDate(evento.date) : toLocalDatetime(evento.date))
                    : ''
                }
                required
                className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm [color-scheme:dark]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Fim</label>
              <input
                key={allDay ? 'date-end' : 'datetime-end'}
                name="date_end"
                type={allDay ? 'date' : 'datetime-local'}
                defaultValue={
                  evento?.date_end
                    ? (allDay ? toLocalDate(evento.date_end) : toLocalDatetime(evento.date_end))
                    : ''
                }
                className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm [color-scheme:dark]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="hidden" name="all_day" value="off" />
            <input
              name="all_day"
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              value="on"
              className="w-4 h-4 accent-[#E8B55B]"
            />
            <span className="text-xs text-white/70">Dia inteiro (sem hora)</span>
          </label>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Localização <span className="text-[#E8B55B]/70">*</span>
            </label>
            <input name="location" defaultValue={evento?.location ?? ''} required
              className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Link externo</label>
            <input
              name="cta_url"
              type="url"
              defaultValue={evento?.cta_url ?? ''}
              placeholder="https://..."
              className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm"
            />
            <p className="text-[10px] text-white/30">Se preenchido, mostra um botão no destaque da landing.</p>
          </div>

          <ImageUploader pathPrefix="eventos/" name="imageurl" currentUrl={evento?.imageurl} compact />

          <SubmitPrimary>
            {isEdit ? 'Guardar Alterações' : 'Criar Evento'}
          </SubmitPrimary>
        </form>
      </DialogContent>
    </Dialog>
  )
}
