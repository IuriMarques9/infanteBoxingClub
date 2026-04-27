'use client';
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Contacto from "@/components/layout/Contacto";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/contexts/language-context";
import { content } from "@/lib/content";

export default function ContactoClient({ modalidade }: { modalidade?: string }) {
  const { language } = useLanguage();
  const C = content[language];

  const modalidadeLabel = modalidade
    ? C.boxingStyles.styles.find((s) => s.slug === modalidade)?.title
    : undefined;

  const defaultMessage = modalidadeLabel
    ? `${C.contact.prefillModalidade} ${modalidadeLabel}.`
    : "";

  const infoItems = [
    { icon: Phone, label: C.contact.infoLabels.phone, value: C.contact.phone, href: `tel:${C.contact.phone.replace(/\s+/g, '')}` },
    { icon: Mail, label: C.contact.infoLabels.email, value: C.contact.email, href: `mailto:${C.contact.email}` },
    { icon: MapPin, label: C.contact.infoLabels.address, value: C.contact.address },
    { icon: Clock, label: C.contact.infoLabels.attendanceHours, value: C.contact.attendanceHours },
  ];

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 min-h-screen bg-background">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4">
              {language === 'pt' ? 'CONTACTO' : 'CONTACT'}
            </span>
            <h1 className="font-headline text-5xl md:text-6xl uppercase text-white">
              {C.contact.title}
            </h1>
            <p className="mt-4 text-lg text-white/60">
              {C.contact.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Esquerda: info + mapa */}
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {infoItems.map(({ icon: Icon, label, value, href }) => {
                  const content = (
                    <div className="card-gold-accent rounded-2xl border border-zinc-800 bg-background p-5 hover:border-primary/30 transition-colors h-full">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 ring-1 ring-primary/30 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{label}</p>
                          <p className="text-sm text-white mt-1 break-words">{value}</p>
                        </div>
                      </div>
                    </div>
                  );
                  return href ? (
                    <a key={label} href={href} className="block">{content}</a>
                  ) : (
                    <div key={label}>{content}</div>
                  );
                })}
              </div>

              {/* Mapa */}
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-3">
                  {C.contact.infoLabels.mapTitle}
                </h2>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800">
                  <iframe
                    src={C.contact.mapsEmbedUrl}
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={C.contact.infoLabels.mapTitle}
                  />
                </div>
              </div>
            </div>

            {/* Direita: formulário */}
            <div className="card-gold-accent rounded-2xl border border-zinc-800 bg-background p-6 md:p-8 self-start">
              <Contacto defaultMessage={defaultMessage} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
