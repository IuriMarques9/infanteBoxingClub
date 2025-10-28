'use client';
import { useLanguage } from "../../../contexts/language-context";
import { content } from "../../../lib/content";
import { useSubfoldersFromFolder } from "@/hooks/use-subfoldersFromFolder";
import CardCollection from "./CardCollection";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function PastEvents() {
  const { language } = useLanguage();
  const C = content[language];
  
  const { pastas, loading, error } = useSubfoldersFromFolder('galeriaEventos'); //Pastas das coleções das imagens

  return (
    <section id="past-events" className="py-16 md:py-24">
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
          <CarouselPrevious className=" md:inline-flex -left-12" />
          <CarouselNext className=" md:inline-flex -right-12" />
        </Carousel>
      </div>
    </section>
  );
}
