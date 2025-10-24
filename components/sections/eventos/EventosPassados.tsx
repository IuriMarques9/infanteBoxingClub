'use client';
import { useLanguage } from "../../../contexts/language-context";
import { content } from "../../../lib/content";
import { useSubfoldersFromFolder } from "@/hooks/use-subfoldersFromFolder";
import { useImagesFromFolder } from "@/hooks/use-imagesFromFolder";
import CardCollection from "./CardCollection";

export default function PastEvents() {
  const { language } = useLanguage();
  const C = content[language];
  
  const { pastas, loading, error } = useSubfoldersFromFolder('galeriaEventos'); //Pastas das coleções das imagens

  console.log(pastas)

  return (
    <section id="past-events" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">{C.pastEvents.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{C.pastEvents.subtitle}</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {
            pastas?.length > 0 ? (
              pastas.map((pasta) => (
                <CardCollection key={pasta.name} pastaData={pasta} />
              ))
            ) : (
              <p>Sem pastas disponíveis.</p>
            )
          }
        </div>
      </div>
    </section>
  );
}
