'use client';
import Image from "next/image";
import { Card } from "../../components/ui/card";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { PlaceHolderImages } from "../../lib/placeholder-images";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Team() {
  const { language } = useLanguage();
  const C = content[language];
  const coaches = C.team.coaches;

  const coachImages = coaches.map((_, index) => 
    PlaceHolderImages.find((img) => img.id === `coach-${index + 1}`)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => { 
    const intervalId = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % coaches.length);
        setIsFading(false);
      }, 500); // Duration of the fade-out transition
    }, 5000); // Time each coach is displayed
    
    return () => clearInterval(intervalId);
  }, [coaches.length]);

  const currentCoach = coaches[currentIndex];
  const currentImage = coachImages[currentIndex];

  return (
    <section id="about" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-6xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">
            {C.team.title}
          </h2>
          <p className="mt-4 text-lg text-justify text-muted-foreground">
            {C.team.subtitle}
          </p>
        </div>
        
        <div className="mt-12 flex justify-center">
            <Card className={cn(
                "overflow-hidden text-center max-w-md w-full transition-opacity duration-500 ease-in-out",
                isFading ? "opacity-0" : "opacity-100"
            )}>
              {currentImage && (
                <Image
                    src={currentImage.imageUrl}
                    alt={currentCoach.name}
                    width={600}
                    height={600}
                    className="w-full h-80 object-cover object-center"
                    data-ai-hint={currentImage.imageHint}
                    key={currentIndex} 
                />
              )}
            </Card>
        </div>
      </div>
    </section>
  );
}
