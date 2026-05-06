import { createClient } from '@/lib/supabase/server'
import { Plus, CalendarDays, Calendar, History } from 'lucide-react'
import EditEventoModal from './EditEventoModal'
import EventoCard from './EventoCard'
import FilterSelect from '../membros/FilterSelect'

export const metadata = { title: 'Eventos | Dashboard' }
export const dynamic = 'force-dynamic'

export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string }>
}) {
  const { filtro = 'futuros' } = await searchParams
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data: todosEventos } = await (supabase
    .from('eventos')
    .select('*')
    .order('date', { ascending: true }) as any)

  const eventos = todosEventos || []
  // Um evento é "passado" só quando o seu fim (ou início, se não houver fim)
  // já passou. Evento em curso continua na lista de futuros.
  const eventoFimRef = (e: any) => (e.date_end ?? e.date) as string
  const futuros = eventos.filter((e: any) => eventoFimRef(e) >= now)
  const passados = eventos.filter((e: any) => eventoFimRef(e) < now)

  let eventosFiltrados = eventos
  if (filtro === 'futuros') eventosFiltrados = futuros
  else if (filtro === 'passados') eventosFiltrados = passados

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-headline font-bold text-[#E8B55B] uppercase tracking-wider">
            Gestão de Eventos
          </h1>
          <p className="text-sm text-white/40 mt-1">Criar, editar e gerir os eventos do clube</p>
        </div>
        <EditEventoModal
          trigger={
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#E8B55B] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#C99C4A] transition-all shadow-[0_0_15px_rgba(232,181,91,0.3)]">
              <Plus className="w-4 h-4" /> Novo Evento
            </button>
          }
        />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Futuros', value: futuros.length, icon: CalendarDays, color: 'text-green-400' },
          { label: 'Passados', value: passados.length, icon: History, color: 'text-white/40' },
          { label: 'Total', value: eventos.length, icon: Calendar, color: 'text-[#E8B55B]' },
        ].map(s => (
          <div
            key={s.label}
            className="bg-[#1A1A1A] rounded-xl border border-white/5 p-4 flex items-center gap-4"
          >
            <s.icon className={`w-8 h-8 ${s.color}`} />
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/40 uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <FilterSelect
        param="filtro"
        value={filtro}
        label="Mostrar"
        options={[
          { value: 'futuros', label: 'Futuros' },
          { value: 'passados', label: 'Passados' },
          { value: 'todos', label: 'Todos' },
        ]}
      />

      {/* Grid or empty state */}
      {eventosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CalendarDays className="w-12 h-12 text-white/10 mb-4" />
          <p className="text-white/30 text-sm">Nenhum evento encontrado</p>
          <p className="text-white/20 text-xs mt-1">Cria o primeiro evento do clube</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {eventosFiltrados.map((e: any) => (
            <EventoCard key={e.id} evento={e} />
          ))}
        </div>
      )}
    </div>
  )
}
