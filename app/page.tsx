'use client';

import Hero from "../components/home/hero/Hero";
import Modalidades from "../components/home/Modalidades";
import Destaques from "../components/home/eventos/Destaques";
import Sobre from "../components/home/Sobre";
import Horario from "../components/home/Horario";
import Loc from "../components/home/Loc";
import Galeria from "../components/home/galeria/Galeria";
import Header from "../components/rootlayout/header";
import Loja from "../components/home/loja/Loja";
import Loader from "../components/rootlayout/loader";
import { useState } from "react";

export default function Home() {

      const [loading, setLoading] = useState(true);

    return (
        <>
            <Loader className={!loading ? "opacity-0" : ""} />

            {/* Header */}                    
            <Header />

            <main className="flex-grow">

                <Hero />

                <div className="h-30 w-full bg-[#CCA158]"></div>

                <Modalidades />

                <Destaques />

                <Galeria />

                <Loja />

                <Sobre />

                <Horario />

                <Loc />
            </main>
        </>
    );
}
