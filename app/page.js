import Hero from "@/components/home/Hero";
import Modalidades from "@/components/home/Modalidades";
import Eventos from "@/components/home/Eventos";
import Sobre from "@/components/home/Sobre";
import Horario from "@/components/home/Horario";
import Loc from "@/components/home/Loc";
export default function Home() {

    return (
        <main>
            <Hero />

            <div className="h-30 w-full bg-[#CCA158]"></div>

            <Modalidades />

            <Eventos />





            <Sobre />

            <Horario />

            <Loc />
        </main>
    );
}
