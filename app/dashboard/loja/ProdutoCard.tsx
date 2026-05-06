'use client'

import Image from 'next/image'
import { Trash2, Archive } from 'lucide-react'
import EditProdutoModal from './EditProdutoModal'
import ConfirmDeleteDialog from '@/components/dashboard/ConfirmDeleteDialog'
import { eliminarProduto } from './actions'

export default function ProdutoCard({ produto, categorias }: { produto: any; categorias: string[] }) {
  return (
    <div className={`bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 hover:border-[#E8B55B]/20 transition-all group ${!produto.published ? 'opacity-50' : ''}`}>
      <div className="relative aspect-square m-3 rounded-xl overflow-hidden">
        {produto.imageurl ? (
          <Image
            src={produto.imageurl}
            alt={produto.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white/20 uppercase text-xs tracking-widest">
            Sem imagem
          </div>
        )}
        {!produto.published && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/10">
            <Archive className="w-3 h-3 text-white/60" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Arquivado</span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-headline text-lg uppercase tracking-wider text-white group-hover:text-[#E8B55B] transition-colors line-clamp-1">
            {produto.name}
          </h3>
          <span className="text-lg font-bold text-[#E8B55B] shrink-0 ml-2">{produto.price}€</span>
        </div>
        {produto.category && (
          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E8B55B]/10 text-[#E8B55B] border border-[#E8B55B]/20">
            {produto.category}
          </span>
        )}
        <div className="flex items-center justify-end gap-1 pt-2 border-t border-white/5">
          <EditProdutoModal produto={produto} categorias={categorias} />
          <ConfirmDeleteDialog
            title={`Eliminar "${produto.name}"?`}
            onConfirm={async () => {
              const fd = new FormData()
              fd.append('id', produto.id)
              await eliminarProduto(fd)
            }}
            trigger={
              <button className="p-2 text-white/20 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            }
          />
        </div>
      </div>
    </div>
  )
}
