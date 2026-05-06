import { createClient } from '@/lib/supabase/server'
import { Plus, ShoppingBag, PackageCheck, Archive, Tag } from 'lucide-react'
import EditProdutoModal from './EditProdutoModal'
import ProdutoCard from './ProdutoCard'
import FilterSelect from '../membros/FilterSelect'

export const metadata = { title: 'Loja | Dashboard' }
export const dynamic = 'force-dynamic'

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; estado?: string }>
}) {
  const params = await searchParams
  const { categoria, estado = 'activos' } = params
  const supabase = await createClient()

  const { data: todosProdutos } = await (supabase
    .from('store_products')
    .select('*')
    .order('created_at', { ascending: false }) as any)

  const produtos = todosProdutos || []
  const categorias = [...new Set(produtos.map((p: any) => p.category).filter(Boolean))] as string[]

  const activos = produtos.filter((p: any) => p.published)
  const arquivados = produtos.filter((p: any) => !p.published)

  let produtosFiltrados = produtos
  if (categoria) produtosFiltrados = produtosFiltrados.filter((p: any) => p.category === categoria)
  if (estado === 'activos') produtosFiltrados = produtosFiltrados.filter((p: any) => p.published)
  else if (estado === 'arquivados') produtosFiltrados = produtosFiltrados.filter((p: any) => !p.published)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-headline font-bold text-[#E8B55B] uppercase tracking-wider">
            Gestão da Loja
          </h1>
          <p className="text-sm text-white/40 mt-1">Produtos, preços e stock do merchandising</p>
        </div>
        <EditProdutoModal
          categorias={categorias}
          trigger={
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#E8B55B] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#C99C4A] transition-all shadow-[0_0_15px_rgba(232,181,91,0.3)]">
              <Plus className="w-4 h-4" /> Novo Produto
            </button>
          }
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: produtos.length, icon: ShoppingBag, color: 'text-[#E8B55B]' },
          { label: 'Activos', value: activos.length, icon: PackageCheck, color: 'text-green-400' },
          { label: 'Arquivados', value: arquivados.length, icon: Archive, color: 'text-white/40' },
          { label: 'Categorias', value: categorias.length, icon: Tag, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#1A1A1A] rounded-xl border border-white/5 p-4 flex items-center gap-4">
            <s.icon className={`w-8 h-8 ${s.color}`} />
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/40 uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {categorias.length > 0 && (
          <FilterSelect
            param="categoria"
            value={categoria || ''}
            label="Categoria"
            options={[
              { value: '', label: 'Todas' },
              ...categorias.map(c => ({ value: c, label: c })),
            ]}
          />
        )}
        <FilterSelect
          param="estado"
          value={estado}
          label="Estado"
          options={[
            { value: 'activos', label: 'Activos' },
            { value: 'arquivados', label: 'Arquivados' },
            { value: 'todos', label: 'Todos' },
          ]}
        />
      </div>

      {produtosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="w-12 h-12 text-white/10 mb-4" />
          <p className="text-white/30 text-sm">Nenhum produto encontrado</p>
          <p className="text-white/20 text-xs mt-1">Adiciona o primeiro artigo à loja</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produtosFiltrados.map((p: any) => (
            <ProdutoCard key={p.id} produto={p} categorias={categorias} />
          ))}
        </div>
      )}
    </div>
  )
}
