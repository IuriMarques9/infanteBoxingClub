"use client";

import { content } from "../../lib/content";
import { useLanguage } from "../../contexts/language-context";
import Image from "next/image";
import { Button } from "../ui/button";

export default function Hero() {
  	const { language } = useLanguage();
	const C = content[language];

    return (
		<section
            id="home"
            className="relative h-dvh flex items-center justify-center text-center text-white"
        >
            <video autoPlay muted loop playsInline src="/videoHero.webm" className="w-full h-full object-fill"></video>
			
            <div className="absolute inset-0 bg-black/70" />

			<div className="relative z-10 p-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
				<Image src={"/infanteLogo.png"} alt="Infante Logo" fill className="object-cover" priority/>

				<h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight uppercase">
					{C.hero.title} <span className="text-primary">{C.hero.titleHighlight}</span>
				</h1>

				<p className="mt-4 text-lg md:text-xl text-neutral-200">
					{C.hero.subtitle}
				</p>

				<div className="mt-8 flex flex-wrap justify-center gap-4">
					<Button size="lg" asChild className="font-bold">
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
