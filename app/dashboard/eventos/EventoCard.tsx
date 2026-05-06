'use client'

import Image from 'next/image'
import { CalendarDays, MapPin, Trash2 } from 'lucide-react'
import EditEventoModal from './EditEventoModal'
import ConfirmDeleteDialog from '@/components/dashboard/ConfirmDeleteDialog'
import { eliminarEvento } from './actions'
import { formatEventDateRange, isEventoPassado } from '@/lib/eventos'

export default function EventoCard({ evento }: { evento: any }) {
  const formattedDate = formatEventDateRange(evento.date, evento.date_end, 'pt', evento.all_day)
  const isPast = isEventoPassado(evento)

  return (
    <div
      className={`bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 hover:border-[#E8B55B]/20 transition-all group ${isPast ? 'opacity-60' : ''}`}
    >
      <div className="relative aspect-video">
        <Image
          src={evento.imageurl || '/placeholder-boxing.jpg'}
          alt={evento.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {isPast && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 rounded-full text-[10px] text-white/50 uppercase tracking-wider">
            Passado
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-headline text-lg uppercase tracking-wider text-white group-hover:text-[#E8B55B] transition-colors line-clamp-1">
          {evento.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-white/50">
          <CalendarDays className="w-4 h-4 text-[#E8B55B]/60 shrink-0" />
          <span>{formattedDate}</span>
        </div>

        {evento.location && (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <MapPin className="w-4 h-4 text-[#E8B55B]/60 shrink-0" />
            <span>{evento.location}</span>
          </div>
        )}

        {evento.description && (
          <p className="text-sm text-white/30 line-clamp-2">{evento.description}</p>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <EditEventoModal evento={evento} />
          <ConfirmDeleteDialog
            title={`Eliminar "${evento.title}"?`}
            onConfirm={async () => {
              const fd = new FormData()
              fd.append('id', evento.id)
              await eliminarEvento(fd)
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
