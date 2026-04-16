"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Instagram, Mail, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import LanguageSwitcher from "../../components/templates/language-switcher";
import Image from "next/image";

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
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'pt-2 md:pt-4' : 'pt-4 md:pt-6'}`}>
      <div className={`mx-auto max-w-6xl transition-all duration-300 ${scrolled ? 'md:px-4' : 'px-4'}`}>
        <div className={`flex items-center justify-between rounded-full bg-black/60 backdrop-blur-xl border border-primary/20 shadow-[0_0_20px_hsl(41_55%_57%/0.15)] px-6 py-3 transition-all duration-300 ${scrolled ? 'bg-black/80' : ''}`}>
          
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src={"/infanteLogo.png"} alt="Infante Logo" height={40} width={40} className="object-cover rounded-full ring-2 ring-primary/50" priority/>
          </Link>

          {/* Desktop Navigation (Centered) */}
          <nav className="hidden md:flex flex-1 justify-center gap-8 items-center">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-semibold uppercase tracking-wider text-zinc-300 transition-all hover:text-primary hover:shadow-[0_0_10px_hsl(41_55%_57%/0.5)] px-2 py-1 relative group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions Area */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <LanguageSwitcher />
            <Button variant="default" size="sm" asChild className="rounded-full font-bold uppercase tracking-wider hover:shadow-[0_0_15px_hsl(41_55%_57%/0.4)]">
              <a href="#schedule">{C.hero.cta}</a>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-primary hover:bg-primary/20 rounded-full">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-full left-4 right-4 mt-2 rounded-2xl bg-black/90 backdrop-blur-2xl border border-primary/20 shadow-2xl transition-all duration-300 origin-top overflow-hidden ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
        <div className="flex flex-col p-6 gap-6">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="text-lg font-medium text-foreground transition-colors hover:text-primary flex gap-3 items-center border-b border-primary/10 pb-2"
              onClick={() => setIsOpen(false)}
            >
              <Icon className="text-primary w-5 h-5" aria-hidden="true" />
              {label}
            </Link>
          ))}
          <div className="flex justify-center gap-6 pt-4 border-t border-primary/20 mt-2">
            <a href="https://www.facebook.com/associacaoinfante.pt" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/infanteboxing_club/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="mailto:geral@associacaoinfate.pt" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header
