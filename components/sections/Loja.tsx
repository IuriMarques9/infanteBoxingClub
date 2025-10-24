'use client';
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { useImagesFromFolder } from "@/hooks/use-imagesFromFolder";

export default function Merch() {
  const { language } = useLanguage();
  const C = content[language];
  const { images, loading, error } = useImagesFromFolder("produtos");
 
 
  return (
    <section id="merch" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">{C.merch.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{C.merch.subtitle}</p>
        </div>
        <Carousel 
          className="mt-12 w-full max-w-6xl mx-auto"
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
            {images.map(image => (
            <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/4">
                <Card className="overflow-hidden text-start h-full">
                  <div className="overflow-hidden group m-8 y-8">
                    <Image
                      src={image.url}
                      alt={image.id}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover aspect-square"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{image.context?.custom?.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">{image.context?.custom?.preco}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
