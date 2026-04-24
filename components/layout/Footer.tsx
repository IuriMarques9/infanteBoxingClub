'use client';
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import RightsReserved from "./RightsReserved";

const Footer = () => {
  const { language } = useLanguage();
  const C = content[language];
  const F = C.footer;

  return (
    <footer className="bg-background border-t border-zinc-800">
      <div className="container mx-auto px-4 pt-16 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Coluna 1: Marca */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/infanteLogo.png" alt="Infante Boxing Club Logo" width={44} height={44} className="rounded-full" />
              <span className="font-headline text-lg tracking-wide text-primary">{F.columns.brand}</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">{F.tagline}</p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://www.facebook.com/profile.php?id=100088583096544"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/infanteboxing_club/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${C.contact.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
              <a
                href={`mailto:${C.contact.email}`}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">{F.columns.nav}</h3>
            <ul className="space-y-2.5">
              {F.nav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Contacto */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">{F.columns.contact}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <Phone className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" strokeWidth={1.8} />
                <a href={`tel:${C.contact.phone.replace(/\s+/g, '')}`} className="hover:text-primary transition-colors">
                  {C.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <Mail className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" strokeWidth={1.8} />
                <a href={`mailto:${C.contact.email}`} className="hover:text-primary transition-colors break-all">
                  {C.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" strokeWidth={1.8} />
                <span>{C.contact.address}</span>
              </li>
            </ul>
            <Link href="/contacto" className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
              {F.fullForm}
            </Link>
          </div>

          {/* Coluna 4: Legal */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">{F.columns.legal}</h3>
            <ul className="space-y-2.5">
              {F.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6">
          <RightsReserved />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
