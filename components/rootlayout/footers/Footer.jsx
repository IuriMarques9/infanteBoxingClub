import Image from "next/image";
import RightsReserved from "./RightsReserved";
import Link from "next/link";
import EmailForm from "./emailForm/EmailForm";

export default function Footer() {
    return (
        <footer className="z-50 text-white bg-[#CCA158] shadow px-5 md:px-10 mx-auto">
            <div id="Contacto" className="flex flex-col md:flex-row md:gap-3 py-5 max-w-[1800px] mx-auto">
                <EmailForm />
                
                <div className="text-white border-1 my-5 md:my-0"></div>
            
                <div className="text-white flex flex-col gap-4 items-center md:items-end md:text-end text-center w-full md:w-2/4 md:justify-evenly">
                    <div className="flex justify-between gap-5 items-center">
                        <Image src="/escudo.png" alt="Escudo" className="w-1/4" width={100} height={60}/>
                            
                        <h4>Respeitamos a sua privacidade</h4>
                    </div>

                    <h6 className="text-justify md:text-end">
                        Este site só recolhe o nome e o email que escreve no formulário de contacto.
                        Usamos esses dados apenas para responder à sua mensagem.
                        Não guardamos os dados, não enviamos publicidade e não partilhamos com ninguém.
                    </h6>

                    <h6>Telemovel: 910389071</h6>
            
                    <h6>Email: associacao.infante@gmail.com</h6>
                </div>
            </div>

            <hr className="text-white border-t-2 max-w-[1800px] mx-auto" />

            <div className="flex flex-col md:flex-row justify-evenly items-center gap-5 py-5 max-w-[1800px] mx-auto">
                <Link href="/privicy" className="w-fit block hover:underline hover:text-[#EAEAEA]">
                    <h6>Politica de Privacidade</h6>
                </Link>
                
                <a href="https://www.instagram.com/fisiomed_cc/" className="hover:grayscale-30 w-2/4 max-w-[150px]">
                    <Image className="w-full" src="/fisiomedLogo.jpg" alt="Logo Cabeçalho" width={120} height={60}/>
                </a>

                <a href="https://www.livroreclamacoes.pt/Inicio/" className="w-fit block hover:underline hover:text-[#EAEAEA]">
                    <h6>Livro de Reclamações</h6>
                </a>
            </div>

            <RightsReserved />
        </footer>
    );
}
