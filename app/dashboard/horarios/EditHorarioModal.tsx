'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit } from 'lucide-react'
import { editarHorario } from './actions'

export default function EditHorarioModal({ horario }: { horario: any }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-white/20 hover:text-[#E8B55B] transition-colors opacity-0 group-hover:opacity-100">
          <Edit className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#121212] border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#E8B55B] font-headline tracking-wider">Editar Horário</DialogTitle>
        </DialogHeader>
        <form action={editarHorario} className="space-y-4">
          <input type="hidden" name="id" value={horario.id} />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Descrição</label>
            <input name="descricao" defaultValue={horario.descricao} required
              className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Hora</label>
            <input name="hora" defaultValue={horario.hora} required
              className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" />
          </div>
          <button type="submit"
            className="w-full py-3 rounded-xl bg-[#E8B55B] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#C99C4A] transition-all">
            Guardar
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
