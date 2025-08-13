import Image from "next/image";
export default function Modalidades() {

    return (
        <section id="Modalidade" className="w-full relative h-full">
                <div className="max-w-[1800px] h-full text-justify mx-auto p-5 md:px-10 md:pb-10 pt-30">

                    <div className="border-b-4 border-[#CCA158] text-left mb-10">
                        <h2>Boxe para Todos: Do Bem-Estar à Alta Competição</h2>
                    </div>
                    
                    <p className="mb-10 !text-xl">No nosso clube, todos têm a oportunidade de praticar boxe, seja com o objetivo de melhorar a forma física e manter um estilo de vida saudável, ou com a ambição de competir e evoluir no desporto. Adaptamos os treinos às tuas metas, oferecendo um ambiente acolhedor para iniciantes e desafiante para quem procura superar limites no ringue.</p>
                    
                    <div className="flex flex-col md:flex-row gap-5 w-full items-center md:justify-evenly md:items-start">
                        
                        <div className="flex flex-col bg-[#CCA158]/80 rounded-xl w-full h-full p-3 max-w-100">
                            <div className="relative overflow-hidden w-full rounded-lg">
                                <div className="w-full h-fit">
                                    <Image width={150} height={150} src="/boxeEducativo.png" alt="Boxe Educativo" className="w-full !max-w-none max-h-80" />
                                </div>
                    
                                <div className="absolute bottom-10 left-0 rounded-r-lg bg-black/70 py-2 px-8">
                                    <h4 className="text-white font-semibold">Boxe Educativo</h4>
                                </div>
                                
                            </div>
                    
                            <div className="py-3 flex-grow">
                                <p className="!text-white">
                                    Boxe Educativo é uma metodologia reconhecida pela Federação Portuguesa de Boxe e por instituições internacionais como um meio eficaz de iniciação à modalidade. Sem contacto pleno, promove o ensino técnico, motor e comportamental, sendo adaptado a diferentes faixas etárias. Utilizado em escolas, clubes e academias, é uma prática segura, acessível e com benefícios amplos na formação global dos praticantes.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col bg-[#CCA158]/80 rounded-xl w-full h-full p-3 max-w-100">
                            <div className="relative overflow-hidden w-full rounded-lg">
                                <div className="w-full h-fit">
                                    <Image width={150} height={150} src="/boxeManutencao.png" alt="Boxe Educativo" className="w-full !max-w-none max-h-80" />
                                </div>
                    
                                <div className="absolute bottom-10 left-0 rounded-r-lg bg-black/70 py-2 px-8">
                                    <h4 className="text-white font-semibold">Boxe Manutenção</h4>
                                </div>
                                
                            </div>
                    
                            <div className="py-3 flex-grow">
                                <p className="!text-white">
                                    O Boxe de Manutenção é uma vertente não competitiva, orientada para a melhoria da condição física através de treinos baseados na metodologia do boxe. Trabalha-se a técnica sem contacto, combinando exercícios com saco de boxe, circuitos físicos, coordenação e mobilidade articular. Ideal para praticantes de todas as idades, promove a saúde física e mental num ambiente seguro, estruturado e motivacional.
                                </p>
                            </div>
                        </div>
                            

                        <div className="flex flex-col bg-[#CCA158]/80 rounded-xl w-full h-full p-3 max-w-100">
                            <div className="relative overflow-hidden w-full rounded-lg">
                                <div className="w-full h-fit">
                                    <Image width={150} height={150} src="/boxeCompeticao.png" alt="Boxe Educativo" className="w-full !max-w-none max-h-80" />
                                </div>
                    
                                <div className="absolute bottom-10 left-0 rounded-r-lg bg-black/70 py-2 px-8">
                                    <h4 className="text-white font-semibold">Boxe Competição</h4>
                                </div>
                                
                            </div>
                            
                            <div className="py-3 flex-grow">
                                <p className="!text-white">
                                    O Boxe de Competição é uma disciplina desportiva regulamentada a nível nacional e internacional. Com divisões por idade, sexo e peso, a competição decorre em ringue, com regras claras e supervisão por árbitros certificados. A prática regular desenvolve força, resistência, coordenação, raciocínio tático e espírito desportivo. Os atletas são acompanhados tecnicamente e têm acesso a provas locais, nacionais e internacionais, podendo evoluir desde a formação até ao alto rendimento.                                        
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    );
}