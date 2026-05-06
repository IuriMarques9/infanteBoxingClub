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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Futuros', value: futuros.length, icon: CalendarDays, iconCls: 'text-green-400 bg-green-400/10' },
          { label: 'Passados', value: passados.length, icon: History, iconCls: 'text-white/60 bg-white/5' },
          { label: 'Total', value: eventos.length, icon: Calendar, iconCls: 'text-[#E8B55B] bg-[#E8B55B]/10' },
        ].map(s => (
          <div
            key={s.label}
            className="bg-[#1A1A1A] rounded-xl border border-white/5 p-3 sm:p-4 flex items-center gap-3 min-w-0"
          >
            <span className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${s.iconCls}`}>
              <s.icon className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-white leading-tight">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider truncate">{s.label}</p>
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
