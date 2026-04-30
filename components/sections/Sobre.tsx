'use client';
import Image from "next/image";
import { Target, Users, Heart, Trophy, ShieldCheck, ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { PlaceHolderImages } from "../../lib/placeholder-images";
import SectionShell from "../shared/SectionShell";
import SectionHeading from "../shared/SectionHeading";

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

  // Papel/título de cada treinador. O 1º é o fundador / head coach;
  // os restantes são treinadores oficiais. Adapta-se a 1, 2 ou 3+.
  const roleFor = (idx: number) =>
    idx === 0
      ? (language === 'pt' ? 'Fundador · Head Coach' : 'Founder · Head Coach')
      : (language === 'pt' ? 'Treinador Oficial' : 'Official Coach');

  const eyebrow = language === 'pt' ? 'SOBRE NÓS' : 'ABOUT US';
  const teamEyebrow = language === 'pt' ? 'EQUIPA TÉCNICA' : 'CHAMPIONSHIP TRAINERS';
  const teamSubtitle = language === 'pt'
    ? 'Treina com quem combateu. Filiados na Federação Portuguesa de Boxe.'
    : 'Train with people who have fought. Members of the Portuguese Boxing Federation.';
  const ctaLabel = language === 'pt' ? 'Marcar 1ª aula grátis' : 'Book your free 1st class';

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

      {/* Equipa Técnica — layout bento inspirado em sites desportivos:
          1 card destaque (fundador) + cards menores em coluna ao lado.
          Em mobile colapsa para uma stack vertical. */}
      <div className="mt-20 max-w-6xl mx-auto">
        {/* Cabeçalho da secção: eyebrow + título + subtítulo + chip federação */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/80 mb-2">
              {teamEyebrow}
            </p>
            {/* h1 da página /sobre — é o único título principal da rota */}
            <h1 className="font-headline text-3xl md:text-4xl uppercase tracking-wider text-white drop-shadow-[0_0_10px_rgba(232,181,91,0.2)]">
              {C.team.teamTitle}
            </h1>
            <p className="text-white/50 text-sm mt-2 max-w-xl">
              {teamSubtitle}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest self-start">
            <ShieldCheck className="w-3.5 h-3.5" /> Federação Portuguesa de Boxe
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* Card destaque — primeiro coach (fundador), ocupa 2 cols em md+ */}
          {coaches[0] && coachImages[0] && (
            <article className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 min-h-[420px] md:min-h-[560px]">
              <Image
                src={coachImages[0].imageUrl}
                alt={coaches[0].name}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                data-ai-hint={coachImages[0].imageHint}
              />
              {/* Gradient overlay para legibilidade do texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              {/* Badge top-left "FOUNDER" */}
              <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(232,181,91,0.5)]">
                <Trophy className="w-3 h-3" /> {language === 'pt' ? 'Fundador' : 'Founder'}
              </div>
              {/* Texto bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">
                  {roleFor(0)}
                </p>
                <h4 className="font-headline text-3xl md:text-5xl uppercase tracking-wider text-white leading-none mb-3">
                  {coaches[0].name}
                </h4>
                <p className="text-white/70 text-sm max-w-md leading-relaxed">
                  {language === 'pt'
                    ? 'A paixão que deu origem ao clube. Mais de uma década a treinar atletas de competição e de manutenção em Olhão.'
                    : 'The passion that started the club. Over a decade training competition and fitness athletes in Olhão.'}
                </p>
              </div>
            </article>
          )}

          {/* Cards secundários — coaches 2..N empilhados na coluna direita */}
          {coaches.slice(1).map((coach, i) => {
            const idx = i + 1;
            const img = coachImages[idx];
            if (!img) return null;
            return (
              <article
                key={coach.name}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 min-h-[260px]"
              >
                <Image
                  src={img.imageUrl}
                  alt={coach.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                  data-ai-hint={img.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary mb-1.5">
                    {roleFor(idx)}
                  </p>
                  <h4 className="font-headline text-2xl uppercase tracking-wider text-white leading-none">
                    {coach.name}
                  </h4>
                </div>
              </article>
            );
          })}

          {/* Se houver apenas 1 coach extra (= 2 no total), preenche o slot
              vazio com um CTA "Marcar 1ª aula grátis" para evitar buraco. */}
          {coaches.length < 3 && (
            <Link
              href="#contact"
              className="group relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 hover:border-primary hover:from-primary/15 transition-all min-h-[260px] flex flex-col justify-end p-5"
            >
              <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">
                {language === 'pt' ? 'Vem treinar' : 'Come train'}
              </p>
              <h4 className="font-headline text-xl md:text-2xl uppercase tracking-wider text-white leading-tight mb-2">
                {ctaLabel}
              </h4>
              <p className="text-white/50 text-xs leading-relaxed">
                {language === 'pt'
                  ? 'Sem compromisso. Apenas roupa confortável e vontade de aprender.'
                  : 'No commitment. Just comfortable clothes and willingness to learn.'}
              </p>
            </Link>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
