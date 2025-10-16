'use client';
import Image from "next/image";
import { Card, CardTitle } from "../../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { useLanguage } from "../../../contexts/language-context";
import { content } from "../../../lib/content";
import { PlaceHolderImages, ImagePlaceholder } from "../../../lib/placeholder-images";

const PastEventCollection = ({ collection, images }: { collection: {name: string, id: string}, images: ImagePlaceholder[]}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Card className="overflow-hidden cursor-pointer group relative text-white border-none shadow-2xl">
        {images[0] && 
          <div className="relative h-80">
            <Image src={images[0].imageUrl} alt={images[0].description} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={images[0].imageHint}/>
            <div className="absolute inset-0 bg-black/50" />
          </div>
        }
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <CardTitle className="font-headline text-4xl text-center drop-shadow-lg">{collection.name}</CardTitle>
        </div>
      </Card>
    </DialogTrigger>
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle className="font-headline text-4xl mb-4">{collection.name}</DialogTitle>
      </DialogHeader>
      <Carousel className="w-full" opts={{align: "start", loop: true,}}>
        <CarouselContent>
          {images.map(image => (
            <CarouselItem key={image.id} className="md:basis-1/2">
              <div className="overflow-hidden rounded-lg">
                <Image src={image.imageUrl} alt={image.description} width={600} height={400} className="w-full h-auto object-cover aspect-video" data-ai-hint={image.imageHint}/>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </DialogContent>
  </Dialog>
);

export default function PastEvents() {
  const { language } = useLanguage();
  const C = content[language];
  
  const pastEvents2023 = PlaceHolderImages.filter(img => img.id.startsWith('event-2023-'));
  const pastEvents2024 = PlaceHolderImages.filter(img => img.id.startsWith('event-2024-'));

  return (
    <section id="past-events" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">{C.pastEvents.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{C.pastEvents.subtitle}</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <PastEventCollection collection={C.pastEvents.collections[1]} images={pastEvents2024} />
          <PastEventCollection collection={C.pastEvents.collections[0]} images={pastEvents2023} />
        </div>
      </div>
    </section>
  );
}
