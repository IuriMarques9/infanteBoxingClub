'use client';
import Image from "next/image";
import { CalendarDays, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useLanguage } from "../../../contexts/language-context";
import { content } from "../../../lib/content";
import { useImagesFromFolder } from "@/hooks/use-imagesFromFolder";
import { useEffect, useState } from "react";

export default function ProximoEvento() {
  const { language } = useLanguage();
  const C = content[language];

  const {images, loading, error} = useImagesFromFolder("proximoEvento");

  const image = images[0] ?? {};

  const [eventDescription , setEventDescription] = useState("");

  useEffect(() => {
    if(language === 'pt'){
      setEventDescription(image.context?.custom?.alt || "")
    }else{
      setEventDescription(image.context?.custom?.paragrafoIngles || "")
    }
  }, [language, image.context?.custom?.alt, image.context?.custom?.paragrafoIngles]);
  
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">
            {C.nextEvent.title} 
          </h2>
        </div>

        {image && loading=== false ? (
          <Card className="mt-12 grid md:grid-cols-2 overflow-hidden shadow-2xl">
            <Image
              src={image?.url ?? "/placeholder.png"}
              alt={`${image.id}`}
              width={image.width || 300}
              height={image.height || 300}
              className="w-full p-8 md:p-12 object-cover max-w-[400px] mx-auto"
            />

            <div className="flex flex-col p-8 md:p-12">
            <h3 className="font-headline text-4xl uppercase">{image.context?.custom?.caption}</h3>
            
            <p className="text-muted-foreground mt-2">{eventDescription}</p>
            
            <div className="space-y-4 mt-6 text-lg">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-6 w-6 text-primary" />
                <span>{image.context?.custom?.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <span>{image.context?.custom?.localizacao}</span>
              </div>
            </div>
            <Button
              onClick={() => {
                const newWin = window.open(image.context?.custom?.linkEvento ?? undefined, "_blank");
                if (newWin) newWin.opener = null;
              }}
              size="lg"
              variant="default"
              className="mt-8 self-start font-bold group text-white"
            >
              {C.nextEvent.cta}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            </div>
          </Card>
          ) : (
            <Loader2 className="text-primary mx-auto animate-spin" />
          )
        }
          
      </div>
    </section>
  );};
