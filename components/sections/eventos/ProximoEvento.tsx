'use client';
import Image from "next/image";
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useLanguage } from "../../../contexts/language-context";
import { content } from "../../../lib/content";
import { useImagesFromFolder } from "@/hooks/use-imagesFromFolder";


export default function NextEvent() {
  const { language } = useLanguage();
  const C = content[language];

  const {images, loading, error} = useImagesFromFolder("proximoEvento");

  console.log(images[0]);

  return (
    <section id="next-event" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">
            {C.nextEvent.title}
          </h2>
        </div>
        <Card className="mt-12 grid md:grid-cols-2 overflow-hidden shadow-2xl">
          {images[0] && (
            <Image
              src={images[0].url}
              alt={'Next Event Image'}
              width={images[0].width}
              height={images[0].height}
              className="w-full h-full object-cover"
            />
          )}
          <div className="flex flex-col p-8 md:p-12">
            <h3 className="font-headline text-4xl uppercase">1</h3>
            <p className="text-muted-foreground mt-2">1</p>
            <div className="space-y-4 mt-6 text-lg">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-6 w-6 text-primary" />
                <span>1</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                <span>1</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <span>1</span>
              </div>
            </div>
            <Button size="lg" className="mt-8 self-start font-bold group">
              {C.nextEvent.cta}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
