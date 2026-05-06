'use client';

import Hero from "../../components/sections/Hero";
import Modalidades from "../../components/sections/Modalidades";
import Horario from "../../components/sections/Horario";
import ContactoCTA from "../../components/sections/ContactoCTA";
import Header from "../../components/layout/Header";
import Loja from "../../components/sections/Loja";
import Eventos from "../../components/sections/Eventos";
import Footer from "../../components/layout/Footer";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { content } from "@/lib/content";
import Parcerias from "@/components/sections/Parcerias";

export default function HomeClient() {
  const { language } = useLanguage();
  const C = content[language];

  useEffect(() => {
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', C.metaDescription);
  }, [language, C.metaDescription]);

  return (
    <>
      <div className="transition-opacity duration-500">
        <Header />

        <main className="flex-grow">
          <Hero />

          <Modalidades />

          <Eventos />

          <Loja />

          <Horario />

          <ContactoCTA />

          <Parcerias />
        </main>

        <Footer />
      </div>
    </>
  );
}
