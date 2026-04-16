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
      
      <div ref={contentRef} className="relative z-10 p-4 max-w-5xl mx-auto">
        <Image src={"/infanteLogo.png"} alt="Infante Logo" height={140} width={140} className="hero-elem object-cover rounded-full mx-auto mb-8 ring-2 ring-primary/30 shadow-[0_0_30px_hsl(41_55%_57%/0.3)]" priority/>
        
        <h1 className="hero-elem font-headline text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tight uppercase leading-none">
          {C.hero.title} {C.hero.titleHighlight}<br/>
          <span className="text-primary text-glow">{language === 'pt' ? 'Boxing' : 'Boxing'} Club</span>
        </h1>
        
        <p className="hero-elem mt-6 text-base md:text-xl text-zinc-300 max-w-2xl mx-auto">
          {C.hero.subtitle}
        </p>
        
        <div className="hero-elem mt-10 flex flex-wrap justify-center gap-4">
          <Button variant="default" size="lg" asChild className="font-bold uppercase tracking-wider text-base px-8 py-6 hover:scale-105 transition-transform hover:shadow-[0_0_20px_hsl(41_55%_57%/0.5)]">
            <a href="#schedule">{C.hero.cta}</a>
          </Button>

          <Button size="lg" asChild className="font-bold uppercase tracking-wider text-base px-8 py-6 bg-transparent border-2 border-zinc-500 text-white hover:bg-white/10 hover:border-white transition-all hover:scale-105" variant="outline">
            <a href="#boxing-styles">{C.navLinks.find(l => l.href === "#boxing-styles")?.label || 'Modalidades'}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
