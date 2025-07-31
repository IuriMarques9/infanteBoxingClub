import ModalidadesCard from "./ModalidadesCard";

export default function Modalidades() {

    return (
        <section id="Modalidade" className="w-full relative h-full">
                <div className="max-w-[1800px] h-full text-justify mx-auto p-5 md:px-10 md:pb-10 pt-30">

                    <div className="border-b-4 border-[#CCA158] text-left mb-10">
                        <h2>Boxe para Todos: Do Bem-Estar à Alta Competição</h2>
                    </div>
                    
                    <p className="mb-10 !text-xl">No nosso clube, todos têm a oportunidade de praticar boxe, seja com o objetivo de melhorar a forma física e manter um estilo de vida saudável, ou com a ambição de competir e evoluir no desporto. Adaptamos os treinos às tuas metas, oferecendo um ambiente acolhedor para iniciantes e desafiante para quem procura superar limites no ringue.</p>
                    
                    <div className="flex flex-col md:flex-row gap-5 w-full items-center md:justify-evenly md:items-start">
                        
                        <ModalidadesCard />
                    </div>
                </div>
            </section>
    );
}