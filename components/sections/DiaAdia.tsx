'use client';
import Image from "next/image";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { useImagesFromFolder } from "@/hooks/use-imagesFromFolder";

export default function DiaAdia() {
  const { language } = useLanguage();
  const C = content[language];

  const { images, loading, error } = useImagesFromFolder("diaAdia");
  console.log(images);
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
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map(image => (
              <div key={image.id} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <Image src={image.url} alt={image.title} width={400} height={400} className="w-full h-full object-cover aspect-square" />
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}
