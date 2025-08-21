
import ProximoEvento from "./ProximoEvento";
import GaleriaEventos from "./GaleriaEventos";

export default function Destaques() {
    
    
    return (
        <>
            <section id="Destaques" className="max-w-[1800px] mx-auto mb-20 h-fit p-5 md:px-10 flex flex-col gap-15">
                <div className="border-b-4 border-[#CCA158] w-fit pr-20">
                    <h2>Destaques</h2>
                </div>

                <ProximoEvento />

                <div className="max-w-100 md:max-w-none mx-auto md:inline-block h-0.5 w-full bg-[#EAEAEA] mx-6"></div>
                
                <GaleriaEventos />
            </section>
        </>
    );
}