'use client';
import Image from "next/image";
import { Target, Users, Heart, type LucideIcon } from "lucide-react";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { PlaceHolderImages } from "../../lib/placeholder-images";
import SectionShell from "../shared/SectionShell";
import SectionHeading from "../shared/SectionHeading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const PILLAR_ICONS: Record<string, LucideIcon> = {
  Target,
  Users,
  Heart,
};

export default function Team() {
  const { language } = useLanguage();
  const C = content[language];
  const coaches = C.team.coaches;
  const pillars = C.team.pillars;

  const coachImages = coaches.map((_, index) =>
    PlaceHolderImages.find((img) => img.id === `coach-${index + 1}`)
  );

  const roleFor = (idx: number) => (idx === 0 ? 'Head Coach' : 'Coach');
  const eyebrow = language === 'pt' ? 'SOBRE NÓS' : 'ABOUT US';

  return (
    <SectionShell id="about" surface="alt">
      <SectionHeading eyebrow={eyebrow} title={C.team.title} />

      {/* Intro narrativa */}
      <div className="mt-8 max-w-3xl mx-auto space-y-4 text-center">
        <p className="text-white/70 text-base md:text-lg leading-relaxed">
          {C.team.intro1}
        </p>
        <p className="text-white/60 text-sm md:text-base leading-relaxed">
          {C.team.intro2}
        </p>
      </div>

      {/* Pilares */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {pillars.map((pillar) => {
          const Icon = PILLAR_ICONS[pillar.icon] ?? Target;
          return (
            <div
              key={pillar.title}
              className="card-gold-accent rounded-2xl border border-zinc-800 bg-background p-6 text-center flex flex-col items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 ring-1 ring-primary/30 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" strokeWidth={1.8} />
              </div>
              <h3 className="font-headline text-lg uppercase tracking-wider text-white">
                {pillar.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {pillar.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Equipa */}
      <div className="mt-16">
        <h3 className="font-headline text-2xl uppercase tracking-wider text-center text-primary mb-8">
          {C.team.teamTitle}
        </h3>

        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {coaches.map((coach, idx) => {
            const img = coachImages[idx];
            return (
              <div
                key={idx}
                className="card-gold-accent overflow-hidden text-center rounded-lg border border-zinc-800 bg-background"
              >
                {img && (
                  <Image
                    src={img.imageUrl}
                    alt={coach.name}
                    width={600}
                    height={600}
                    className="w-full aspect-square object-cover object-center"
                    data-ai-hint={img.imageHint}
                  />
                )}
                <div className="p-4 flex flex-col items-center gap-2">
                  <h4 className="font-headline text-xl uppercase tracking-wider text-white">
                    {coach.name}
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 ring-1 ring-primary/30 rounded-full px-3 py-1">
                    {roleFor(idx)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden flex justify-center">
          <Carousel
            className="w-full max-w-sm"
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
          >
            <CarouselContent>
              {coaches.map((coach, idx) => {
                const img = coachImages[idx];
                return (
                  <CarouselItem key={idx}>
                    <div className="card-gold-accent overflow-hidden text-center max-w-sm w-full rounded-lg border border-zinc-800 bg-background">
                      {img && (
                        <Image
                          src={img.imageUrl}
                          alt={coach.name}
                          width={600}
                          height={600}
                          className="w-full object-cover object-center"
                          data-ai-hint={img.imageHint}
                        />
                      )}
                      <div className="p-4 flex flex-col items-center gap-2">
                        <h4 className="font-headline text-xl uppercase tracking-wider text-white">
                          {coach.name}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 ring-1 ring-primary/30 rounded-full px-3 py-1">
                          {roleFor(idx)}
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </SectionShell>
  );
}
