import { createClient } from '@/lib/supabase/server'
import { Plus, Trash2, Calendar, MapPin, Edit, Image as ImageIcon } from 'lucide-react'
import { criarEvento, eliminarEvento, editarEvento } from './actions'

// ─── PÁGINA DE GESTÃO DE EVENTOS ──────────────────────────────
// Permite ao administrador gerir os eventos do clube.
export const metadata = { title: 'Gestão de Eventos | Dashboard' }

export default async function EventosDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const searchParamsData = await searchParams

  const { data: eventos } = await (supabase
    .from('eventos')
    .select('*')
    .order('date', { ascending: false }) as any)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-headline font-bold text-[#E8B55B] tracking-wider">
          Gestão de Eventos
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Gere as galas, interclubes e sessões especiais que aparecem na Landing Page.
        </p>
      </div>

      {/* Erros */}
      {searchParamsData?.error && (
        <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm">
          Ocorreu um erro na operação. Tenta novamente.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Formulário de Criação/Edição (Simplified as Creation for now) */}
        <div className="xl:col-span-1">
          <div className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-xl sticky top-8">
            <h2 className="text-lg font-headline font-bold text-[#E8B55B] tracking-wider mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Novo Evento
            </h2>
            
            <form action={criarEvento} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Título do Evento</label>
                <input 
                  name="title" 
                  required 
                  placeholder="Ex: Gala Infante Boxing"
                  className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Descrição</label>
                <textarea 
                  name="description" 
                  required 
                  rows={3}
                  placeholder="Detalhes do evento..."
                  className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm resize-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Data e Hora</label>
                  <input 
                    name="date" 
                    type="datetime-local" 
                    required 
                    className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm [color-scheme:dark]" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Localização</label>
                  <input 
                    name="location" 
                    required 
                    placeholder="Cidade/Ginasio"
                    className="w-full px-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E8B55B] text-sm" 
                  />
                </div>
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
                <p className="text-[10px] text-white/30 italic mt-1">Dica: Podes copiar o link de uma imagem no Supabase Storage.</p>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-[#E8B55B] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#C99C4A] shadow-[0_0_15px_rgba(232,181,91,0.2)] transition-all mt-2"
              >
                Criar Evento
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Eventos Existentes */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-lg font-headline font-bold text-white/90 tracking-wider mb-4">
            Eventos Registados ({eventos?.length || 0})
          </h2>
          
          {eventos && eventos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {eventos.map((evento: any) => {
                const dateObj = new Date(evento.date);
                const isPast = dateObj < new Date();
                
                return (
                  <div key={evento.id} className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden flex flex-col md:flex-row shadow-lg group">
                    {/* Thumbnail */}
                    <div className="w-full md:w-48 h-32 bg-zinc-800 relative shrink-0">
                      {evento.imageurl ? (
                        <img src={evento.imageurl} alt={evento.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 uppercase font-headline tracking-tighter">No Image</div>
                      )}
                      {isPast && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 border border-white/20 px-2 py-1 rounded">Passado</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-white group-hover:text-[#E8B55B] transition-colors">{evento.title}</h3>
                          <div className="flex gap-2">
                             <form action={eliminarEvento}>
                               <input type="hidden" name="id" value={evento.id} />
                               <button type="submit" className="p-2 text-white/20 hover:text-red-400 transition-colors">
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             </form>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-xs text-white/50">
                            <Calendar className="w-3.5 h-3.5 text-[#E8B55B]" />
                            {dateObj.toLocaleString('pt-PT')}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-white/50">
                            <MapPin className="w-3.5 h-3.5 text-[#E8B55B]" />
                            {evento.location}
                          </div>
                        </div>
                        
                        <p className="text-xs text-white/40 mt-3 line-clamp-1">{evento.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#121212] rounded-2xl border border-dashed border-white/10 p-12 text-center">
              <p className="text-white/30 text-sm italic">Nenhum evento registado até ao momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
