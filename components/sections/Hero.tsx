"use client";

import { content } from "../../lib/content";
import { useLanguage } from "../../contexts/language-context";
import { Button } from "../ui/button";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const { language } = useLanguage();
  const C = content[language];
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-elem", {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.3,
          ease: "power3.out",
          delay: 0.2,
        });
      });
    },
    { scope: heroRef }
  );

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative h-dvh flex items-center justify-center text-center text-white"
    >
      <video
        src="/videoHero.webm"
        poster="/infanteLogoSemFundo.png"
        autoPlay
        loop
        muted
        playsInline
        // preload="metadata" obtém só os primeiros bytes (duração,
        // dimensões) — o conteúdo só é descarregado quando o autoPlay
        // efectivamente arranca, o que liberta a rede para o LCP.
        preload="metadata"
        // O poster é o LCP (não o vídeo) — fetchPriority alta ajuda.
        // @ts-expect-error fetchpriority é HTML attr válido mas não está nos types
        fetchpriority="high"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Dark cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[hsl(0,0%,5%)]" />

      <div ref={contentRef} className="relative z-10 p-4 max-w-7xl mx-auto w-full flex flex-col justify-center items-end text-right h-full pr-8 md:pr-16 lg:pr-24">
        {/* We keep the logo for brand identity, but smaller and integrated before the text if necessary, or just rely on Header text */}
        <h1 className="hero-elem font-headline text-6xl md:text-8xl lg:text-[8rem] font-bold tracking-tight uppercase leading-[0.9]">
          <span className="text-white/90 drop-shadow-lg">{C.hero.title}</span><br/>
          <span className="text-[#E8B55B] drop-shadow-[0_0_20px_rgba(232,181,91,0.5)]">{C.hero.titleHighlight} {C.hero.titleSuffix}</span>
        </h1>

        <p className="hero-elem mt-6 text-lg md:text-2xl text-white/80 max-w-xl font-medium tracking-wide uppercase">
          {C.hero.subtitle}
        </p>

        <div className="hero-elem mt-10">
          <Button variant="default" size="lg" asChild className="rounded-full bg-[#E8B55B] hover:bg-[#C99C4A] text-black font-extrabold uppercase tracking-widest text-lg md:text-xl px-10 py-8 shadow-[0_0_20px_rgba(232,181,91,0.4)] hover:shadow-[0_0_35px_rgba(232,181,91,0.7)] transition-all hover:scale-105">
             <a href="#visit">{C.hero.ctaPrimary}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
