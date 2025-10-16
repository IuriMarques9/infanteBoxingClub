'use client';
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel"
import { useLanguage } from "../../../contexts/language-context";
import { content } from "../../../lib/content";
import { PlaceHolderImages } from "../../../lib/placeholder-images";

export default function Merch() {
  const { language } = useLanguage();
  const C = content[language];
  const merchImages = PlaceHolderImages.filter(img => img.id.startsWith('merch-'));

  return (
    <section id="merch" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">{C.merch.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{C.merch.subtitle}</p>
        </div>
        <Carousel className="mt-12 w-full max-w-6xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}>
          <CarouselContent>
            {C.merch.products.map((product, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                <Card className="overflow-hidden text-center h-full">
                  {merchImages[index] &&
                    <Image src={merchImages[index].imageUrl} alt={merchImages[index].description} width={400} height={500} className="w-full h-64 object-cover" data-ai-hint={merchImages[index].imageHint}/>
                  }
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{product.price}</p>
                    <Button className="mt-4 w-full">{C.merch.cta}</Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
