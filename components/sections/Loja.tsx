'use client';
import Image from "next/image";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { useImagesFromFolder } from "@/hooks/use-imagesFromFolder";
import { Loader2 } from "lucide-react";

export default function Merch() {
  const { language } = useLanguage();
  const C = content[language];
  const { images, loading, error } = useImagesFromFolder("produtos");
 
  return (
    <section id="merch" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">{C.merch.title}</h2>
          <div className="section-divider mt-4"></div>
          <p className="mt-6 text-lg text-muted-foreground">{C.merch.subtitle}</p>
        </div>
        <Carousel 
          className="mt-14 w-full mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: true,
            })
          ]}
        >
          <CarouselContent>
            {loading === false ? (
              images.map(image => (
              <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="card-gold-accent bg-card rounded-lg overflow-hidden border border-zinc-800 text-start h-full hover:border-primary/40 transition-all duration-300">
                    <div className="overflow-hidden group m-8 y-8">
                      <Image
                        src={image.url}
                        alt={image.id}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover aspect-square max-w-[300px] mx-auto"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl uppercase tracking-wider text-foreground">{image.context?.custom?.caption ?? ""}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold text-primary">{image.context?.custom?.preco}</p>
                    </CardContent>
                  </div>
                </CarouselItem>
            ))
          ) : (
            <Loader2 className="text-primary mx-auto animate-spin" />
          )
        }
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
