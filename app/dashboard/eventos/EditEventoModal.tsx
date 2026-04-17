'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit, Image as ImageIcon } from 'lucide-react'
import { editarEvento } from './actions'

export default function EditEventoModal({ evento }: { evento: any }) {
  const [open, setOpen] = useState(false)

  // Converter ISO para formato datetime-local
  const toLocalDatetime = (iso: string) => {
    const d = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 text-white/20 hover:text-[#E8B55B] transition-colors">
          <Edit className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#121212] border border-white/10 text-white max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-[#E8B55B] font-headline tracking-wider">Editar Evento</DialogTitle>
        </DialogHeader>
        <form action={editarEvento} className="space-y-4">
          <input type="hidden" name="id" value={evento.id} />

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Título</label>
            <input name="title" defaultValue={evento.title} required
              className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Descrição</label>
            <textarea name="description" defaultValue={evento.description} required rows={3}
              className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Data e Hora</label>
              <input name="date" type="datetime-local" defaultValue={toLocalDatetime(evento.date)} required
                className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm [color-scheme:dark]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Localização</label>
              <input name="location" defaultValue={evento.location} required
                className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">URL da Imagem</label>
            <div className="relative">
              <input name="imageurl" defaultValue={evento.imageurl || ''} placeholder="https://..."
                className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" />
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            </div>
          </div>

          <button type="submit"
            className="w-full py-3 rounded-xl bg-[#E8B55B] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#C99C4A] transition-all mt-2">
            Guardar Alterações
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
