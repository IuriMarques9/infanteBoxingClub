'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit, Euro, Plus, ArrowLeft } from 'lucide-react'
import { criarProduto, editarProduto } from './actions'
import ImageUploader from '@/components/dashboard/ImageUploader'
import { SubmitPrimary } from '@/components/dashboard/FormButtons'

interface Props {
  produto?: {
    id: string
    name: string
    price: number
    description: string | null
    imageurl: string | null
    published: boolean
    category: string | null
  } | null
  categorias?: string[]
  trigger?: ReactNode
}

export default function EditProdutoModal({ produto, categorias = [], trigger }: Props) {
  const [open, setOpen] = useState(false)
  const isEdit = !!produto

  // Categoria: dropdown se já houver categorias e a do produto pertence
  // a essa lista (ou não há ainda). Input livre se admin quer criar
  // nova ou se o catálogo está vazio.
  const hasCategorias = categorias.length > 0
  const initialCategory = produto?.category ?? ''
  const productHasUnknownCategory =
    !!initialCategory && !categorias.includes(initialCategory)
  const [creatingNew, setCreatingNew] = useState(
    !hasCategorias || productHasUnknownCategory,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#E8B55B]/70 hover:text-[#E8B55B] hover:bg-[#E8B55B]/10 transition-all">
            <Edit className="w-3.5 h-3.5" /> Editar
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#121212] border border-white/10 text-white max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#E8B55B] font-headline tracking-wider">
            {isEdit ? 'Editar Artigo' : 'Novo Artigo'}
          </DialogTitle>
        </DialogHeader>
        <form
          action={isEdit ? editarProduto : criarProduto}
          onSubmit={() => setOpen(false)}
          className="space-y-3"
        >
          {isEdit && <input type="hidden" name="id" value={produto.id} />}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Nome <span className="text-[#E8B55B]/70">*</span>
            </label>
            <input name="name" defaultValue={produto?.name} required
              className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                Preço <span className="text-[#E8B55B]/70">*</span>
              </label>
              <div className="relative">
                <input name="price" type="number" step="0.01" defaultValue={produto?.price} required
                  className="w-full pl-9 pr-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" />
                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              </div>
            </div>
            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5 h-[38px] cursor-pointer hover:bg-white/[0.07] transition-colors">
                <input type="hidden" name="archived" value="off" />
                <input
                  name="archived"
                  type="checkbox"
                  defaultChecked={produto ? !produto.published : false}
                  value="on"
                  className="w-4 h-4 accent-[#E8B55B]"
                />
                <span className="text-xs text-white/70">Arquivar artigo</span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Descrição</label>
            <input name="description" defaultValue={produto?.description || ''}
              className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Categoria</label>
            <div className="flex gap-2">
              {creatingNew ? (
                <>
                  <input
                    key="cat-new"
                    name="category"
                    defaultValue={initialCategory}
                    placeholder={hasCategorias ? 'Nova categoria' : 'Ex: Vestuário'}
                    className="flex-1 px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm"
                  />
                  {hasCategorias && (
                    <button
                      type="button"
                      onClick={() => setCreatingNew(false)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 border border-white/10 hover:text-white hover:bg-white/5 transition-colors"
                      aria-label="Voltar à lista de categorias"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                    </button>
                  )}
                </>
              ) : (
                <>
                  <select
                    key="cat-select"
                    name="category"
                    defaultValue={initialCategory}
                    className="flex-1 px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm appearance-none cursor-pointer [color-scheme:dark]"
                  >
                    <option value="">— Sem categoria —</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setCreatingNew(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#E8B55B] border border-[#E8B55B]/20 hover:bg-[#E8B55B]/10 transition-colors"
                    aria-label="Criar nova categoria"
                  >
                    <Plus className="w-3.5 h-3.5" /> Nova
                  </button>
                </>
              )}
            </div>
          </div>

          <ImageUploader pathPrefix="produtos/" name="imageurl" currentUrl={produto?.imageurl} compact />

          <SubmitPrimary>
            {isEdit ? 'Guardar Alterações' : 'Criar Artigo'}
          </SubmitPrimary>
        </form>
      </DialogContent>
    </Dialog>
  )
}
