'use client';
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { PlaceHolderImages } from "../../lib/placeholder-images";

export default function BoxingStyles() {
  const { language } = useLanguage();
  const C = content[language];

  const competitionBoxingImg = PlaceHolderImages.find((img) => img.id === "competition-boxing");
  const maintenanceBoxingImg = PlaceHolderImages.find((img) => img.id === "maintenance-boxing");
  const educationalBoxingImg = PlaceHolderImages.find((img) => img.id === "educational-boxing");

  return (
    <section id="boxing-styles" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">
            {C.boxingStyles.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {C.boxingStyles.subtitle}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="overflow-hidden">
              {competitionBoxingImg && <Image src={competitionBoxingImg.imageUrl} alt={competitionBoxingImg.description} width={100} height={100} className="w-full h-48 object-cover" data-ai-hint={competitionBoxingImg.imageHint}/>}
            <CardHeader>
              <CardTitle className="font-headline text-3xl">{C.boxingStyles.styles[0].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{C.boxingStyles.styles[0].description}</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            {maintenanceBoxingImg && <Image src={maintenanceBoxingImg.imageUrl} alt={maintenanceBoxingImg.description} width={400} height={300} className="w-full h-48 object-cover" data-ai-hint={maintenanceBoxingImg.imageHint}/>}
            <CardHeader>
              <CardTitle className="font-headline text-3xl">{C.boxingStyles.styles[1].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{C.boxingStyles.styles[1].description}</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            {educationalBoxingImg && <Image src={educationalBoxingImg.imageUrl} alt={educationalBoxingImg.description} width={400} height={300} className="w-full h-48 object-cover" data-ai-hint={educationalBoxingImg.imageHint}/>}
            <CardHeader>
              <CardTitle className="font-headline text-3xl">{C.boxingStyles.styles[2].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{C.boxingStyles.styles[2].description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
