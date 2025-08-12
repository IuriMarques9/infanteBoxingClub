import RightsReserved from "@/components/rootlayout/footers/RightsReserved";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Infante Boxing Club - Política de Privacidade",
    description: "Saiba como tratamos os seus dados pessoais no Infante Boxing Club.",
};

export default function Privacidade() {
    return (	
        <>
			<header className="min-w-[300px] flex py-6 px-5 items-center justify-between bg-[#CCA158] shadow w-full">
				<Link href="/" className="flex items-center gap-2 hover:scale-110">
					<ArrowLeft className="text-white" size={25} />
					<h5 className="!text-white font-semibold">Voltar</h5>
				</Link>
			</header>

            <main className="max-w-[1800px] mx-auto p-10 space-y-10 ">
				<div className="px-4 py-6 bg-[#EAEAEA] rounded-xs">
					<h2 className="text-2xl font-bold mb-2 !text-black">Política de Privacidade</h2>
					<p>Na Infante Boxing Club, respeitamos a sua privacidade. Este site apenas recolhe os dados pessoais nome e email através do formulário de contacto, com o único objetivo de responder à dúvida ou questão que nos enviou.</p>
				</div>
    
			<section>
				<h3 className="text-xl font-semibold mb-2 !text-[#CCA158]">1. O que fazemos com os seus dados:</h3>
				
				<ul>
					<li className="text-gray-600 mb-2">Os dados são usados exclusivamente para responder ao seu pedido de contacto.</li>
					<li className="text-gray-600 mb-2">Não são guardados em bases de dados, nem utilizados para qualquer outra finalidade.</li>
					<li className="text-gray-600 mb-2">Não são partilhados com terceiros.</li>
					<li className="text-gray-600 mb-2">Após a resposta, os dados são descartados e não ficam registados nos nossos sistemas.</li>
				</ul>
			</section>

			<section>
				<h3 className="text-xl font-semibold mb-2 !text-[#CCA158]">2. Base legal</h3>
				<p className="text-gray-600">O tratamento é feito com base no seu consentimento explícito ao preencher e submeter o formulário.</p>
			</section>

		

			<section>
				<h3 className="text-xl font-semibold mb-2 !text-[#CCA158]">3. Contactos</h3>
				
				<p className="text-gray-600">Para qualquer questão sobre esta política ou sobre os seus dados, pode contactar-nos através de:</p>
				
				<h5 className="!text-base"><span className="text-gray-600">Email:</span> associacao.infante@gmail.com</h5>
				<h5 className="!text-base"><span className="text-gray-600">Telémovel:</span> 910389071</h5>
			</section>
  	    </main>
        
        <RightsReserved />                      
    </>
)
}