"use client";

import { content } from "../../lib/content";
import { useLanguage } from "../../contexts/language-context";
import { Button } from "../ui/button";

export default function Hero() {
  	const { language } = useLanguage();
	const C = content[language];

    return (
		<section
      id="home"
      className="relative h-dvh flex items-center justify-center text-center text-white"
    >
      <video
        src="/videoHero.webm"
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 p-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
        
	 	    <h1 className="font-headline text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight uppercase">
          {C.hero.title} {C.hero.titleHighlight}<span className="text-primary"> Club</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-neutral-200">
          {C.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="default" size="lg" asChild className="font-bold">
            <a href="#schedule">{C.hero.cta}</a>
          </Button>

          <Button size="lg" asChild className="font-bold" variant="outline">
            <a href="#contact">{C.navLinks.find(l => l.href === "#contact")?.label}</a>
          </Button>
        </div>
      </div>
    </section>
    );
}
