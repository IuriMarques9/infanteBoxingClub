'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { CalendarDays, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatEventDateRange } from '@/lib/eventos'
import { useLanguage } from '@/contexts/language-context'

export default function EventosFuturos() {
  const { language } = useLanguage()
  const [eventos, setEventos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEventos() {
      setLoading(true)
      try {
        const supabase = createClient()
        const today = new Date()

        // Fetch tudo, filtra client-side por coalesce(date_end, date) >= now,
        // depois skip o primeiro (hero) e mostra os 6 seguintes.
        const { data } = await supabase
          .from('eventos')
          .select('*')
          .order('date', { ascending: true })

        const futuros = (data || []).filter((e: any) => {
          const ref = e.date_end ?? e.date
          return new Date(ref) >= today
        })

        setEventos(futuros.slice(1, 7))
      } catch (e) {
        console.error('Erro a carregar eventos futuros', e)
      } finally {
        setLoading(false)
      }
    }
    fetchEventos()
  }, [])

  // Hide silently if no extra events
  if (loading || eventos.length === 0) return null

  return (
    <div className="mt-12 md:mt-16">
      <h3 className="font-headline text-2xl uppercase tracking-wider text-[#E8B55B] mb-6 md:mb-8">
        Próximos eventos
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventos.map(evento => {
          const formattedDate = formatEventDateRange(evento.date, evento.date_end, language, evento.all_day)
          const title = (language === 'en' && evento.title_en) || evento.title
          const location = (language === 'en' && evento.location_en) || evento.location

          return (
            <div
              key={evento.id}
              className="bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-[#E8B55B]/30 transition-all duration-300 group"
            >
              <div className="relative aspect-video">
                <Image
                  src={evento.imageurl ?? '/placeholder-boxing.jpg'}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-headline text-lg uppercase tracking-wider text-foreground group-hover:text-[#E8B55B] transition-colors line-clamp-1">
                  {title}
                </h4>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <CalendarDays className="w-4 h-4 text-[#E8B55B]/60" />
                  <span>{formattedDate}</span>
                </div>
                {location && (
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <MapPin className="w-4 h-4 text-[#E8B55B]/60" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
