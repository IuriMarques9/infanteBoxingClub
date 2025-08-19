import Hero from "@/components/home/hero/Hero";
import Modalidades from "@/components/home/Modalidades";
import Destaques from "@/components/home/eventos/Destaques";
import Sobre from "@/components/home/Sobre";
import Horario from "@/components/home/Horario";
import Loc from "@/components/home/Loc";
import Galeria from "@/components/home/galeria/Galeria";
import Header from "@/components/rootlayout/headers/Header";
import Loja from "@/components/home/loja/Loja";
export default function Home() {

    return (
        <>
            {/* Header */}                    
            <Header />

            <main>

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
