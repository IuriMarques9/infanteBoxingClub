"use client";

import { content } from "../../lib/content";
import { useLanguage } from "../../contexts/language-context";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const { language } = useLanguage();
  const C = content[language];
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-elem", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
        delay: 0.2
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative h-dvh flex items-center justify-center text-center text-white"
    >
      <video
        src="/videoHero.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Dark cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[hsl(0,0%,5%)]" />
      
      <div ref={contentRef} className="relative z-10 p-4 max-w-7xl mx-auto w-full flex flex-col justify-center items-end text-right h-full pr-8 md:pr-16 lg:pr-24">
        {/* We keep the logo for brand identity, but smaller and integrated before the text if necessary, or just rely on Header text */}
        <h1 className="hero-elem font-headline text-6xl md:text-8xl lg:text-[8rem] font-bold tracking-tight uppercase leading-[0.9]">
          <span className="text-white/90 drop-shadow-lg">{C.hero.title}</span><br/>
          <span className="text-[#E8B55B] drop-shadow-[0_0_20px_rgba(232,181,91,0.5)]">Boxing Club</span>
        </h1>
        
        <p className="hero-elem mt-6 text-lg md:text-2xl text-white/80 max-w-xl font-medium tracking-wide uppercase">
          {language === 'pt' ? 'Treina com Campeões. Liberta o teu potencial.' : 'Train with Champions. Unleash your potential.'}
        </p>
        
        <div className="hero-elem mt-10">
          <Button variant="default" size="lg" asChild className="rounded-full bg-[#E8B55B] hover:bg-[#C99C4A] text-black font-extrabold uppercase tracking-widest text-lg md:text-xl px-10 py-8 shadow-[0_0_20px_rgba(232,181,91,0.4)] hover:shadow-[0_0_35px_rgba(232,181,91,0.7)] transition-all hover:scale-105">
             <a href="#schedule">{language === 'pt' ? 'Começa a Treinar Agora' : 'Start Training Now'}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
