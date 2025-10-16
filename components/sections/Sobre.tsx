'use client';
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel"
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { PlaceHolderImages } from "../../lib/placeholder-images";

export default function Team() {
  const { language } = useLanguage();
  const C = content[language];

  const coach1Image = PlaceHolderImages.find((img) => img.id === "coach-1");
  const coach2Image = PlaceHolderImages.find((img) => img.id === "coach-2");

  return (
    <section id="team" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">
            {C.team.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {C.team.subtitle}
          </p>
        </div>
        <Carousel className="mt-12 w-full max-w-4xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}>
          <CarouselContent>
            {C.team.coaches.map((coach, index) => (
              <CarouselItem key={index} className="md:basis-1/2">
                <Card className="overflow-hidden text-center h-full">
                  <Image
                    src={index === 0 ? (coach1Image?.imageUrl || '') : (coach2Image?.imageUrl || '')}
                    alt={coach.name}
                    width={600}
                    height={600}
                    className="w-full h-80 object-cover object-center"
                    data-ai-hint={index === 0 ? (coach1Image?.imageHint || '') : (coach2Image?.imageHint || '')}
                  />
                  <CardHeader>
                    <CardTitle className="font-headline text-3xl">{coach.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {coach.description}
                    </p>
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
