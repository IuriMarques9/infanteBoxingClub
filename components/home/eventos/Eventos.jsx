import Image from "next/image";
import Meses from "./Meses";

export default function Eventos() {

    return (
        <>
            <section id="Eventos" className="max-w-[1800px] mx-auto h-fit p-5 md:px-10 flex flex-col gap-15">
                <div className="border-b-4 border-[#CCA158]">
                    <h2>Proximos Eventos</h2>
                </div>

                <div className="flex flex-col items-center md:flex-row gap-15 md:gap-5 w-full">
                    <div className="flex self-start w-full">{/*Year Events*/}
                        {/*Linha vertical*/}
                        <div className="w-1 border-3 border-[#CCA158] flex items-end translate-y-2"> 
                            <Meses />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}