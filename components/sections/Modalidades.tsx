'use client';
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Dumbbell, GraduationCap, ArrowRight, type LucideIcon } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionShell from "../shared/SectionShell";
import SectionHeading from "../shared/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const MODALIDADE_ICONS: Record<string, LucideIcon> = {
  Trophy,
  Dumbbell,
  GraduationCap,
};

export default function BoxingStyles() {
  const { language } = useLanguage();
  const C = content[language];
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          ".mod-card",
          { y: 50, opacity: 0 },
          {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
          }
        );
      });
      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const eyebrow = language === 'pt' ? 'MODALIDADES' : 'DISCIPLINES';

  return (
    <SectionShell id="boxing-styles" surface="default">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full z-0 pointer-events-none" />

      <div ref={sectionRef} className="relative z-10">
        <SectionHeading
          eyebrow={eyebrow}
          title={C.boxingStyles.title}
          subtitle={C.boxingStyles.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {C.boxingStyles.styles.map((style, index) => {
            const Icon = MODALIDADE_ICONS[style.icon] ?? Trophy;
            return (
              <div
                key={style.slug}
                className="mod-card card-gold-accent group bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden border border-zinc-800 hover:border-primary/50 hover:shadow-[0_0_30px_hsl(41_55%_57%/0.15)] transition-all duration-300 hover:-translate-y-2 flex flex-col"
              >
                {/* Imagem + icon badge */}
                <div className="overflow-hidden relative h-64">
                  <div className="absolute inset-0 bg-zinc-800" />
                  <Image
                    src={style.image}
                    alt={style.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-primary/90 backdrop-blur shadow-[0_0_20px_hsl(41_55%_57%/0.5)] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-background" strokeWidth={2.2} />
                  </div>
                </div>

                <CardHeader className="relative z-10">
                  <CardTitle className="font-headline text-2xl uppercase tracking-wider text-primary">
                    {style.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10 flex flex-col gap-4 flex-1">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {style.description}
                  </p>

                  <Link
                    href={{ pathname: '/contacto', query: { modalidade: style.slug } }}
                    className="mt-auto inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider hover:gap-3 transition-all"
                  >
                    {C.boxingStyles.ctaLabel}
                    <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                  </Link>
                </CardContent>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
