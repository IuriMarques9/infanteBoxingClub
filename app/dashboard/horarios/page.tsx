import { createClient } from '@/lib/supabase/server'
import { Plus, Trash2, Clock } from 'lucide-react'
import { TURMA_LABELS, type Turma } from '../membros/constants'
import { criarHorario, eliminarHorario } from './actions'

// ─── PÁGINA DE GESTÃO DE HORÁRIOS ──────────────────────────────
// Permite ao administrador definir os horários de treino de cada turma.
// Os horários ficam visíveis publicamente na Landing Page.
export const metadata = { title: 'Horários | Dashboard' }

export default async function HorariosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParamsData = await searchParams
  const supabase = await createClient()

  const { data: horarios } = await (supabase
    .from('horarios')
    .select('*')
    .order('turma', { ascending: true }) as any)

  const turmas: Turma[] = ['gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres']

  // Agrupar horários por turma para uma visualização limpa
  const horariosAgrupados: Record<string, any[]> = {}
  turmas.forEach(t => { horariosAgrupados[t] = [] })
  ;(horarios || []).forEach((h: any) => {
    if (horariosAgrupados[h.turma]) {
      horariosAgrupados[h.turma].push(h)
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-headline font-bold text-[#E8B55B] tracking-wider">
          Horários e Turmas
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Define os horários de treino de cada turma. Estes dados são apresentados na Landing Page.
        </p>
      </div>

      {/* Erros */}
      {searchParamsData?.error && (
        <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm">
          Ocorreu um erro. Tenta novamente.
        </div>
      )}

      {/* Grid de Turmas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {turmas.map(turma => (
          <div key={turma} className="bg-[#121212] rounded-2xl border border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden">
            
            {/* Cabeçalho da turma */}
            <div className="px-6 py-4 border-b border-white/5 bg-[#E8B55B]/5">
              <h3 className="text-lg font-headline font-bold text-[#E8B55B] tracking-wider flex items-center gap-2">
                <Clock className="w-5 h-5" /> {TURMA_LABELS[turma]}
              </h3>
            </div>

            {/* Lista de horários desta turma */}
            <div className="p-6 space-y-3">
              {horariosAgrupados[turma].length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">Nenhum horário definido.</p>
              ) : (
                horariosAgrupados[turma].map((h: any) => (
                  <div key={h.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 group">
                    <div>
                      <p className="text-sm text-white/80 font-medium">{h.descricao}</p>
                      <p className="text-xs text-[#E8B55B]">{h.hora}</p>
                    </div>
                    <form action={eliminarHorario}>
                      <input type="hidden" name="id" value={h.id} />
                      <button type="submit" className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ))
              )}

              {/* Mini formulário para adicionar horário */}
              <form action={criarHorario} className="pt-3 border-t border-white/5 space-y-3">
                <input type="hidden" name="turma" value={turma} />
                <input
                  name="descricao"
                  placeholder="Ex: Segunda, Quarta e Sexta"
                  required
                  className="w-full px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#E8B55B] placeholder:text-white/20"
                />
                <input
                  name="hora"
                  placeholder="Ex: 19:00 às 20:00"
                  required
                  className="w-full px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#E8B55B] placeholder:text-white/20"
                />
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#E8B55B]/10 text-[#E8B55B] border border-[#E8B55B]/20 text-xs font-bold uppercase tracking-wider hover:bg-[#E8B55B]/20 transition-all">
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
