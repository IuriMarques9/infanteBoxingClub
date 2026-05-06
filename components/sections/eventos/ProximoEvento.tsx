'use client';
import Image from "next/image";
import { CalendarDays, MapPin, ArrowRight, CalendarX2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useLanguage } from "../../../contexts/language-context";
import { content } from "../../../lib/content";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import SectionHeading from "../../shared/SectionHeading";
import EmptyState from "../../shared/EmptyState";
import Skeleton from "../../shared/Skeleton";
import { formatEventDateRange } from "@/lib/eventos";

export default function ProximoEvento() {
  const { language } = useLanguage();
  const C = content[language];
  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      try {
        const supabase = createClient();
        const today = new Date().toISOString();

        // Evento "actual" = ainda não terminou. Inclui os que começaram
        // mas têm date_end no futuro (em curso), e os que ainda nem
        // começaram. Filtra client-side por causa do COALESCE.
        const { data } = await supabase
           .from('eventos')
           .select('*')
           .order('date', { ascending: true });

        const futuros = (data || []).filter((e: any) => {
          const ref = e.date_end ?? e.date;
          return new Date(ref) >= new Date(today);
        });

        if (futuros.length > 0) {
          setEvento(futuros[0]);
        }
      } catch (e) {
         console.error('Erro a carregar evento', e);
      } finally {
         setLoading(false);
      }
    }
    fetchEvent();
  }, []);

  if (loading) {
    return (
      <div>
        <SectionHeading title={C.nextEvent.title} />
        <Skeleton variant="card" className="h-96" />
      </div>
    );
  }

  if (!evento) {
    return (
      <div>
        <SectionHeading title={C.nextEvent.title} />
        <EmptyState
          icon={CalendarX2}
          title={C.events.empty.title}
          description={C.events.empty.description}
        />
      </div>
    );
  }

  const formattedDate = formatEventDateRange(evento.date, evento.date_end, language, evento.all_day);

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none -translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <SectionHeading title={C.nextEvent.title} />

        <div className={`card-gold-accent grid md:grid-cols-2 overflow-hidden relative bg-card/60 backdrop-blur-md rounded-2xl shadow-xl transition-all duration-300 hover:shadow-[0_0_20px_hsl(41_55%_57%/0.15)] border border-primary/20`}>
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card z-10 hidden md:block" />
            <Image
              src={evento.imageurl ?? "/placeholder-boxing.jpg"}
              alt={evento.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>

          <div className="flex flex-col p-8 md:p-12 z-20 bg-card/40 md:bg-transparent">
            <h3 className="font-headline text-4xl uppercase text-foreground text-glow">{evento.title}</h3>

            <p className="text-muted-foreground mt-4 leading-relaxed">{evento.description}</p>

            <div className="space-y-4 mt-8 text-lg bg-black/50 p-6 rounded-xl border border-primary/10 shadow-inner text-foreground">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-6 w-6 text-primary" />
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="font-medium">{evento.location}</span>
              </div>
            </div>

            {evento.cta_url && (
              <Button
                asChild
                size="lg"
                variant="default"
                className="mt-8 self-start font-extrabold uppercase tracking-widest text-black hover:bg-primary/90 group shadow-[0_0_15px_hsl(41_55%_57%/0.4)] transition-all hover:scale-105"
              >
                <a href={evento.cta_url} target="_blank" rel="noopener noreferrer">
                  {C.nextEvent.cta}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
