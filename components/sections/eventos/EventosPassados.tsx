'use client';
import { useLanguage } from "../../../contexts/language-context";
import { content } from "../../../lib/content";
import { useSubfoldersFromFolder } from "@/hooks/use-subfoldersFromFolder";
import CardCollection from "./CardCollection";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function PastEvents() {
  const { language } = useLanguage();
  const C = content[language];
  
  const { pastas, loading, error } = useSubfoldersFromFolder('galeriaEventos'); //Pastas das coleções das imagens

  pastas?.sort((a, b) => {
    const getDateFromName = (name: string): Date | null => {
      const part = name.split(':')[1];
      if (!part) return null;
      if (part.length === 8) {
        const day = Number(part.slice(0, 2));
        const month = Number(part.slice(2, 4)) - 1; // meses são baseados em 0
        const year = Number(part.slice(4));
        return new Date(year, month, day);
      }
      if (part.length === 10) {
        const day = Number(part.slice(2, 4));
        const month = Number(part.slice(4, 6)) - 1; // meses são baseados em 0
        const year = Number(part.slice(6));
        return new Date(year, month, day);
      }
      return null;
    };

    const dateA = getDateFromName(a.name);
    const dateB = getDateFromName(b.name);

    if (dateA && dateB) {
      return dateB.getTime() - dateA.getTime(); // Sort descending (most recent first)
    }
    if (dateA && !dateB) {
      return -1; // a has a date, b doesn't -> a comes first
    }
    if (!dateA && dateB) {
      return 1; // b has a date, a doesn't -> b comes first
    }
    return 0; // neither has a parsable date
    });

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">{C.pastEvents.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{C.pastEvents.subtitle}</p>
        </div>
        <Carousel 
          className="mt-12 w-full max-w-4xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
          
        >
          <CarouselContent>
          {
            pastas?.length > 0 ? (
              pastas.map((pasta) => (
                <CarouselItem key={pasta.external_id} className="md:basis-1/2">
                  <div className="p-1 h-full">
                    <CardCollection folderName={pasta.name} />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <p>Sem pastas disponíveis.</p>
            )
          }
          </CarouselContent>
          
          <div className="absolute left-12 -bottom-6 hidden md:flex ">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
