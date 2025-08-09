import Image from "next/image";
export default function ModalidadesCard() {

  return (
    <div className="flex flex-col bg-[#1F1F1F]/40 rounded-xl w-full h-full p-3 max-w-100">
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
  );
}
