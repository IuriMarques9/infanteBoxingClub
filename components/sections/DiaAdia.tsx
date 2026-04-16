'use client';
import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { ImageData, useImagesFromFolder } from "@/hooks/use-imagesFromFolder";
import {
  Dialog,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import ImageDisplay from "../templates/imageDisplay";
import { Loader2 } from "lucide-react";

const INITIAL_VISIBLE_IMAGES = 4;

export default function DiaAdia() {
  const { language } = useLanguage();
  const C = content[language];
  const { images, loading, error } = useImagesFromFolder("diaAdia");
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [visibleImagesCount, setVisibleImagesCount] = useState(INITIAL_VISIBLE_IMAGES);


  const showMoreImages = () => {
    setVisibleImagesCount(images.length);
  };

  return (
    <section id="daily-life" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">
            {C.dailyLife.title}
          </h2>
          <div className="section-divider mt-4"></div>
          <p className="mt-6 text-lg text-muted-foreground">
            {C.dailyLife.subtitle}
          </p>
        </div>

        <Dialog>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading === false ? (
              images.slice(0, visibleImagesCount).map(image => (
                <DialogTrigger asChild key={image.id} onClick={() => setSelectedImage(image)}>
                  <div className="overflow-hidden rounded-lg border border-zinc-800 hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                    <Image
                      src={image.url}
                      alt={image.id}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105 group-hover:brightness-75"
                      />
                  </div>
                </DialogTrigger>
              )
            )
          ) : (
            <Loader2 className="absolute left-[50%] text-primary mx-auto animate-spin" />
          )
        }
        </div>  
          

          {images.length > visibleImagesCount && loading === false && (
            <div className="mt-8 text-center">
              <Button onClick={showMoreImages} size="lg" className="font-bold uppercase tracking-wider">
                {C.dailyLife.cta}
              </Button>
            </div>
          )}
          
          <ImageDisplay selectedImage={selectedImage} />
        </Dialog>
      </div>
    </section>
  );
}
