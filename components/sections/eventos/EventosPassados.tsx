'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendarDays, MapPin, Loader2 } from "lucide-react";
import { useLanguage } from "../../../contexts/language-context";
import { content } from "../../../lib/content";
import { createClient } from "@/lib/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function PastEvents() {
  const { language } = useLanguage();
  const C = content[language];
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPast() {
      setLoading(true);
      try {
        const supabase = createClient();
        const today = new Date().toISOString();
        const { data } = await supabase
          .from('eventos')
          .select('*')
          .lt('date', today)
          .order('date', { ascending: false });
        if (data) setEventos(data);
      } catch (e) {
        console.error("Erro a carregar eventos passados", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPast();
  }, []);

  return (
    <section id="passedEvents" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">{C.pastEvents.title}</h2>
          <div className="section-divider mt-4"></div>
          <p className="mt-6 text-lg text-muted-foreground">{C.pastEvents.subtitle}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : eventos.length === 0 ? (
          <div className="mt-12 text-center py-16 text-white/30 border border-dashed border-white/10 rounded-2xl">
            {language === 'pt' ? 'Ainda não há eventos passados.' : 'No past events yet.'}
          </div>
        ) : (
          <Carousel className="mt-12 mx-auto" opts={{ align: "start", loop: eventos.length > 3 }}>
            <CarouselContent>
              {eventos.map((evento) => {
                const d = new Date(evento.date);
                const formatted = new Intl.DateTimeFormat(language === 'pt' ? 'pt-PT' : 'en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric'
                }).format(d);
                return (
                  <CarouselItem key={evento.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="card-gold-accent bg-background/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 h-full group hover:border-primary/40 transition-all duration-300 shadow-2xl">
                      <div className="relative h-56 bg-zinc-900 overflow-hidden">
                        {evento.imageurl ? (
                          <Image
                            src={evento.imageurl}
                            alt={evento.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10 uppercase font-headline tracking-widest">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                      </div>
                      <div className="p-6">
                        <h3 className="font-headline text-2xl uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                          {evento.title}
                        </h3>
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="w-3.5 h-3.5 text-primary" /> {formatted}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 text-primary" /> {evento.location}
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{evento.description}</p>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {eventos.length > 3 && (
              <div className="absolute left-12 -bottom-6 hidden md:flex">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            )}
          </Carousel>
        )}
      </div>
    </section>
  );
}
