'use client';

import Hero from "../components/sections/Hero";
import Modalidades from "../components/sections/Modalidades";
import Sobre from "../components/sections/Sobre";
import Horario from "../components/sections/Horario";
import Loc from "../components/sections/Loc";
import Galeria from "../components/sections/galeria/Galeria";
import Header from "../components/layout/Header";
import Loja from "../components/sections/loja/Loja";
import Loader from "../components/layout/Loader";
import Eventos from "../components/sections/eventos/Eventos";
import Footer from "../components/layout/Footer";
import { useState, useEffect } from "react";

export default function Home() {

      const [loading, setLoading] = useState(true);
  
    useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);
    return (
        <>
            <Loader className={!loading ? "hidden" : ""} />
            <div className={loading ? "hidden" : "visible transition-opacity duration-500"}>   
            
                {/* Header */}                    
                <Header />

                <main className="flex-grow">

                    <Hero />

                    <Modalidades />

                    <Eventos />

                    <Galeria />

                    <Loja />

                    <Sobre />

                    <Horario />

                    <Loc />
                </main>
                {/* Footer */}
                <Footer />
            </div>
        </>
    );
}
