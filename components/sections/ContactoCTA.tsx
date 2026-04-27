'use client';
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import SectionShell from "../shared/SectionShell";

export default function ContactoCTA() {
  const { language } = useLanguage();
  const C = content[language];

  const copy = language === 'pt'
    ? { badge: '1ª aula grátis', title: 'Queres começar a treinar connosco?', subtitle: 'Contacta-nos e experimenta a tua primeira aula sem compromisso.', cta: 'Contacta-nos' }
    : { badge: '1st class free', title: 'Ready to start training with us?', subtitle: 'Get in touch and try your first class for free, no strings attached.', cta: 'Contact us' };

  return (
    <SectionShell id="visit" surface="alt">
      <div className="relative max-w-3xl mx-auto text-center rounded-2xl border border-zinc-800 bg-background/60 backdrop-blur-md p-10 md:p-14 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-primary/10 ring-1 ring-primary/30 flex items-center justify-center">
            <Gift className="w-6 h-6 text-primary" strokeWidth={1.8} />
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 text-primary px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]">
            {copy.badge}
          </span>

          <h2 className="font-headline text-4xl md:text-5xl uppercase text-white">
            {copy.title}
          </h2>

          <p className="text-white/70 text-base md:text-lg max-w-xl">
            {copy.subtitle}
          </p>

          <Link
            href={`/${language}/contacto`}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary text-background px-7 py-3 font-extrabold uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(232,181,91,0.3)] hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(232,181,91,0.6)] hover:gap-3 transition-all"
          >
            {copy.cta}
            <ArrowRight className="w-4 h-4" strokeWidth={2.4} />
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
