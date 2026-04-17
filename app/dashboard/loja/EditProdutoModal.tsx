'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit, DollarSign, Image as ImageIcon } from 'lucide-react'
import { editarProduto } from './actions'

export default function EditProdutoModal({ produto }: { produto: any }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#E8B55B]/70 hover:text-[#E8B55B] hover:bg-[#E8B55B]/10 transition-all">
          <Edit className="w-3.5 h-3.5" /> Editar
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#121212] border border-white/10 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#E8B55B] font-headline tracking-wider">Editar Artigo</DialogTitle>
        </DialogHeader>
        <form action={editarProduto} className="space-y-4">
          <input type="hidden" name="id" value={produto.id} />

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Nome</label>
            <input name="name" defaultValue={produto.name} required
              className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Preço (€)</label>
              <div className="relative">
                <input name="price" type="number" step="0.01" defaultValue={produto.price} required
                  className="w-full pl-8 pr-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" />
                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              </div>
            </div>
            <div className="space-y-1.5 flex flex-col justify-end">
              <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5 h-[38px]">
                <input name="in_stock" type="checkbox" defaultChecked={produto.in_stock} className="w-4 h-4 accent-[#E8B55B]" />
                <span className="text-xs text-white/70">Em Stock</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Descrição</label>
            <input name="description" defaultValue={produto.description || ''}
              className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">URL da Imagem</label>
            <div className="relative">
              <input name="imageurl" defaultValue={produto.imageUrl || ''} placeholder="https://..."
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
