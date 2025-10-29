'use client';
import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { ImageData } from "../../interfaces/CloudinaryInterfaces";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Download } from "lucide-react";
import { useImagesFromFolder } from "@/hooks/use-imagesFromFolder";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const INITIAL_VISIBLE_IMAGES = 4;

export default function DiaAdia() {
  const { language } = useLanguage();
  const C = content[language];
  const { images, loading, error } = useImagesFromFolder("diaAdia");
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [visibleImagesCount, setVisibleImagesCount] = useState(INITIAL_VISIBLE_IMAGES);

  const handleDownload = (image: ImageData) => {
    //ACABAR O BOTAO DE DOWNLOAD
  };

  const showMoreImages = () => {
    setVisibleImagesCount(images.length);
  };

  return (
    <section id="daily-life" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">
            {C.dailyLife.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {C.dailyLife.subtitle}
          </p>
        </div>

        <Dialog>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">

            {images.slice(0, visibleImagesCount).map(image => (
              <DialogTrigger asChild key={image.id} onClick={() => setSelectedImage(image)}>
                <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <Image
                    src={image.url}
                    alt={image.id}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover aspect-square transition-all duration-300 group-hover:brightness-75"
                    />
                </div>
              </DialogTrigger>
            ))}
          </div>

          {images.length > visibleImagesCount && (
            <div className="mt-8 text-center">
              <Button onClick={showMoreImages} size="lg" className="font-bold text-white">
                {C.dailyLife.cta}
              </Button>
            </div>
          )}
          
          {selectedImage && (
            <DialogContent aria-describedby={undefined} className="max-w-4xl p-2">
              <DialogPrimitive.DialogTitle />
               <div className="relative aspect-video">
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.id}
                    fill
                    className="object-contain rounded-md"
                    />
               </div>
               <div className="flex justify-end p-2">
                 <Button onClick={() => handleDownload(selectedImage)}>
                   <Download className="mr-2 h-4 w-4" />
                   Download
                 </Button>
               </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </section>
  );
}
