'use client';

import Hero from "../components/sections/Hero";
import Modalidades from "../components/sections/Modalidades";
import Sobre from "../components/sections/Sobre";
import Horario from "../components/sections/Horario";
import Loc from "../components/sections/Loc";
import Galeria from "../components/sections/DiaAdia";
import Header from "../components/layout/Header";
import Loja from "../components/sections/Loja";
import Eventos from "../components/sections/Eventos";
import Footer from "../components/layout/Footer";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { content } from "@/lib/content";
import Parcerias from "@/components/sections/Parcerias";

export default function Home() {
    const { language } = useLanguage();
    const C = content[language];
  
    

  useEffect(() => {
    document.querySelector('meta[name="description"]')?.setAttribute('content', C.metaDescription);
  }, [language, C.metaDescription]);

    return (
        <>
            <div className="transition-opacity duration-500">   
            
                {/* Header */}                    
                <Header />

                <main className="flex-grow">

                    <Hero />

                    <Sobre />

                    <Modalidades />

                    <Loja />

                    <Eventos />

                    <Galeria />

                    <Parcerias />

                    <Horario />
                    
                    <Loc />
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
}
