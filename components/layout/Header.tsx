"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "../ui/button";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import LanguageSwitcher from "../language-switcher";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const C = content[language];
  const navLinks = C.navLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src={"/infanteLogo.png"} alt="Infante Logo" height={50} width={50} className="object-cover rounded-full" priority/>
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-10">
                <Link href="/" className="flex items-center gap-2 mb-4" onClick={() => setIsOpen(false)}>
                  <Image src={"/infanteLogo.png"} alt="Infante Logo" fill className="object-cover" priority/>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                 <Button asChild className="mt-4">
                  <Link href="#contact" onClick={() => setIsOpen(false)}>{C.contact.title}</Link>
                </Button>
                <div className="pt-4">
                  <LanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
