'use client';

import Hero from "../components/home/Hero";
import Modalidades from "../components/home/Modalidades";
import Destaques from "../components/home/eventos/Destaques";
import Sobre from "../components/home/Sobre";
import Horario from "../components/home/Horario";
import Loc from "../components/home/Loc";
import Galeria from "../components/home/galeria/Galeria";
import Header from "../components/rootlayout/header";
import Loja from "../components/home/loja/Loja";
import Loader from "../components/rootlayout/loader";
import Footer from "../components/rootlayout/footers/Footer";
import { useState } from "react";

export default function Home() {

      const [loading, setLoading] = useState(false);

    return (
        <>
            <Loader className={!loading ? "opacity-0" : ""} />
            <div className={loading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>   
            
                {/* Header */}                    
                <Header />

                <main className="flex-grow">

                    <Hero />

                    <Modalidades />

                    <Destaques />

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
