'use client';
import Image from "next/image";
import { CalendarDays, MapPin, ArrowRight, CalendarX2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useLanguage } from "../../../contexts/language-context";
import { content } from "../../../lib/content";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import SectionShell from "../../shared/SectionShell";
import SectionHeading from "../../shared/SectionHeading";
import EmptyState from "../../shared/EmptyState";
import Skeleton from "../../shared/Skeleton";

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

        const { data } = await supabase
           .from('eventos')
           .select('*')
           .gte('date', today)
           .order('date', { ascending: true })
           .limit(1);

        if (data && data.length > 0) {
          setEvento(data[0]);
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
      <SectionShell surface="default">
        <SectionHeading title={C.nextEvent.title} />
        <Skeleton variant="card" className="h-96" />
      </SectionShell>
    );
  }

  if (!evento) {
    return (
      <SectionShell surface="default">
        <SectionHeading title={C.nextEvent.title} />
        <EmptyState
          icon={CalendarX2}
          title={C.events.empty.title}
          description={C.events.empty.description}
        />
      </SectionShell>
    );
  }

  const eventDate = new Date(evento.date);

  const formattedDate = new Intl.DateTimeFormat(language === 'pt'? 'pt-PT' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(eventDate);

  return (
    <SectionShell surface="default">
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

            <div className="space-y-4 mt-8 text-lg bg-black/50 p-6 rounded-xl border border-primary/10 shadow-inner">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-6 w-6 text-primary" />
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="font-medium">{evento.location}</span>
              </div>
            </div>

            <Button
              size="lg"
              variant="default"
              className="mt-8 self-start font-extrabold uppercase tracking-widest text-black hover:bg-primary/90 group shadow-[0_0_15px_hsl(41_55%_57%/0.4)] transition-all hover:scale-105"
            >
              {C.nextEvent.cta}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
