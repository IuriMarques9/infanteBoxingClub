import { createClient } from '@/lib/supabase/server'
import { Plus, Trash2, ShoppingBag, DollarSign, Package, Image as ImageIcon } from 'lucide-react'
import { criarProduto, eliminarProduto } from './actions'

// ─── PÁGINA DE GESTÃO DA LOJA ──────────────────────────────
// Permite ao administrador gerir o stock e preços do Merch.
export const metadata = { title: 'Gestão da Loja | Dashboard' }

export default async function LojaDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const searchParamsData = await searchParams

  const { data: produtos } = await (supabase
    .from('store_products')
    .select('*')
    .order('created_at', { ascending: false }) as any)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-headline font-bold text-[#E8B55B] tracking-wider">
          Gestão da Loja
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Controla o stock, preços e imagens dos artigos de Merchandising.
        </p>
      </div>

      {/* Erros */}
      {searchParamsData?.error && (
        <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm">
          Ocorreu um erro ao processar o artigo.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Formulário Novo Produto */}
        <div className="xl:col-span-1">
          <div className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-xl sticky top-8">
            <h2 className="text-lg font-headline font-bold text-[#E8B55B] tracking-wider mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Novo Artigo
            </h2>
            
            <form action={criarProduto} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Nome do Produto</label>
                <input 
                  name="name" 
                  required 
                  placeholder="Ex: T-shirt Infante Gold"
                  className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Preço (€)</label>
                  <div className="relative">
                    <input 
                      name="price" 
                      type="number" 
                      step="0.01" 
                      required 
                      placeholder="25.00"
                      className="w-full pl-8 pr-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" 
                    />
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  </div>
                </div>
                <div className="space-y-1.5 flex flex-col justify-end">
                  <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5 h-[38px]">
                    <input name="in_stock" type="checkbox" defaultChecked className="w-4 h-4 accent-[#E8B55B]" />
                    <span className="text-xs text-white/70">Em Stock</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Descrição Curta</label>
                <input 
                  name="description" 
                  placeholder="Ex: 100% Algodão, Edição Limitada"
                  className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">URL da Imagem</label>
                <div className="relative">
                  <input 
                    name="imageurl" 
                    placeholder="https://..."
                    className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" 
                  />
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-[#E8B55B] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#C99C4A] shadow-[0_0_15px_rgba(232,181,91,0.2)] transition-all mt-2"
              >
                Adicionar Artigo
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="xl:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {produtos && produtos.length > 0 ? (
              produtos.map((prod: any) => (
                <div key={prod.id} className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden flex flex-col shadow-lg group">
                  <div className="h-48 bg-zinc-800 relative">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10 uppercase font-headline tracking-widest">No Photo</div>
                    )}
                    {!prod.in_stock && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-red-500 border border-red-500/30 px-3 py-1 bg-red-500/10 rounded-full">Sem Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-white tracking-tight">{prod.name}</h3>
                        <p className="text-[#E8B55B] font-bold">{prod.price}€</p>
                      </div>
                      <p className="text-xs text-white/40 mb-4">{prod.description || 'Sem descrição'}</p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase font-bold tracking-widest">
                         <Package className="w-3 h-3" /> {prod.in_stock ? 'Disponível' : 'Indisponível'}
                      </div>
                      <form action={eliminarProduto}>
                        <input type="hidden" name="id" value={prod.id} />
                        <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-all">
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-[#121212] rounded-2xl border border-dashed border-white/10 p-20 text-center">
                <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/30 text-sm italic">A tua loja está vazia. Adiciona o primeiro produto à esquerda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
