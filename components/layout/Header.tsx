"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, Facebook, Instagram, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { BUSINESS, WHATSAPP_URL, MAILTO_URL } from "../../lib/business";
import LanguageSwitcher from "../../components/templates/language-switcher";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language } = useLanguage();
  const C = content[language];
  const navLinks = C.navLinks;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'pt-4' : 'pt-6 md:pt-8'}`}>
      <div className={`mx-auto max-w-7xl transition-all duration-300 px-4`}>
        <div className="flex items-center justify-between rounded-[2rem] bg-[#0A0A0A]/70 backdrop-blur-md border border-[#333333] shadow-2xl px-5 py-2.5 transition-colors duration-300 hover:bg-[#0A0A0A]/80">

          {/* Logo */}
          <Link href={`/${language}`} className="flex items-center shrink-0" aria-label="Infante Boxing Club">
            <Image
              src="/infanteLogoSemFundo.png"
              alt="Infante Boxing Club"
              width={44}
              height={44}
              priority
              className="w-10 h-10 md:w-11 md:h-11 object-contain"
            />
          </Link>

          {/* Desktop Navigation + Actions (right-aligned) */}
          <nav className="hidden xl:flex ml-auto gap-6 items-center">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href.startsWith('/') && !href.startsWith(`/${language}`) ? `/${language}${href === '/' ? '' : href}` : href}
                className="text-xs font-bold uppercase tracking-wider text-white/80 transition-all hover:text-[#E8B55B] px-1 py-1 relative group"
              >
                {label}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#E8B55B] transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions Area */}
          <div className="hidden xl:flex items-center gap-4 shrink-0 ml-6">
            <LanguageSwitcher />
            <Link href="/login" className="text-white/80 hover:text-[#E8B55B] transition-colors" title="Login / Área Reservada">
              <User className="w-5 h-5" />
            </Link>
            <Button asChild className="rounded-full bg-[#E8B55B] hover:bg-[#C99C4A] text-black font-extrabold uppercase tracking-widest text-xs px-5 py-4 shadow-[0_0_15px_rgba(232,181,91,0.3)] hover:shadow-[0_0_25px_rgba(232,181,91,0.6)] transition-all">
              <a href={`/${language}#visit`}>{C.nav.joinCta}</a>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <div className="xl:hidden flex items-center gap-3 shrink-0">
            <LanguageSwitcher />
            <Link href="/login" className="text-[#E8B55B]">
              <User className="w-5 h-5" />
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-[#E8B55B] hover:bg-white/10 rounded-full">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`xl:hidden absolute top-[calc(100%+16px)] left-4 right-4 rounded-[2rem] bg-[#0A0A0A]/95 backdrop-blur-3xl border border-[#333333] shadow-2xl transition-all duration-300 origin-top overflow-hidden ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
        <div className="flex flex-col p-6 gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href.startsWith('/') && !href.startsWith(`/${language}`) ? `/${language}${href === '/' ? '' : href}` : href}
              className="text-sm font-bold uppercase tracking-widest text-white/80 transition-colors hover:text-[#E8B55B] flex gap-3 items-center border-b border-white/5 pb-4"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-4">
             {/* Sociais — replicam EXACTAMENTE os do Footer (mesmos URLs, mesmo
                 tamanho w-10/h-10, mesmo set de 4 ícones FB/IG/WA/Mail).
                 O LanguageSwitcher já está disponível na barra do topo do navbar. */}
             <div className="flex items-center gap-2 flex-wrap">
                <a
                   href={BUSINESS.social.facebook}
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="Facebook"
                   className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#E8B55B]/10 hover:border-[#E8B55B]/40 hover:text-[#E8B55B] transition-all"
                >
                   <Facebook className="w-4 h-4" />
                </a>
                <a
                   href={BUSINESS.social.instagram}
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="Instagram"
                   className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#E8B55B]/10 hover:border-[#E8B55B]/40 hover:text-[#E8B55B] transition-all"
                >
                   <Instagram className="w-4 h-4" />
                </a>
                <a
                   href={WHATSAPP_URL}
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="WhatsApp"
                   className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#E8B55B]/10 hover:border-[#E8B55B]/40 hover:text-[#E8B55B] transition-all"
                >
                   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/>
                   </svg>
                </a>
                <a
                   href={MAILTO_URL}
                   aria-label="Email"
                   className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#E8B55B]/10 hover:border-[#E8B55B]/40 hover:text-[#E8B55B] transition-all"
                >
                   <Mail className="w-4 h-4" />
                </a>
             </div>
             <Button asChild className="rounded-full bg-[#E8B55B] hover:bg-[#C99C4A] text-black font-extrabold uppercase tracking-widest text-xs px-6">
                <a href={`/${language}#visit`} onClick={() => setIsOpen(false)}>{C.nav.joinCta}</a>
             </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
