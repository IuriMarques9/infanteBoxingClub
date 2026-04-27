"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
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
             <LanguageSwitcher />
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
