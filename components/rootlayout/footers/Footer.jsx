import Image from "next/image";
import RightsReserved from "./RightsReserved";

export default function Footer() {
    return (
        <footer className="z-50 text-white bg-[#CCA158] shadow px-5 md:px-10 mx-auto">
            <div id="Contacto" className="flex flex-col md:flex-row md:gap-3 py-5 max-w-[1800px] mx-auto">
                <form className="w-full text-white flex flex-col gap-2">
                    <h4>Envie-nos email</h4>
                    
                    <h6>Preencha este formulario em caso de duvidas, sugestões ou se tiver interesse em marcar uma aula. Prometemos ser o mais breves possivel.</h6>

                    <div className="flex flex-col gap-1"> { /* Input Name */}
                        <label htmlFor="nome">Nome *</label>
                        <input placeholder="Primeiro e último nome" type="text" name="nome" required />
                    </div>
                    
                    <div className="flex flex-col gap-1"> { /*Input Email */}
                        <label htmlFor="email">Email *</label>
                        <input placeholder="exemplo@exemplo.com" type="email" name="email" required />
                    </div>
            
                    <div className="flex flex-col gap-1"> { /* Input Messsage */}
                        <label htmlFor="mensagem">Mensagem *</label>
                        <textarea placeholder="Escreve aqui a tua mensagem" rows="3" name="mensagem" required></textarea>
                    </div>
            
                    <div>
                        <label className="container"> { /* Input CheckBox */}               
                            <input id="CheckBox" type="checkbox" className="h-fit" name="politica" required />
                            <span className="checkmark"></span>
                            <span className="text-[0.8em]">Concordo com a </span>
                        </label>
                        <a href="/privicy.html" className="font-[600] text-[0.8em] underline hover:text-[#EAEAEA]">Politica de Privacidade</a> *
                    </div>
            
                    <button type="submit" value="Enviar" className="py-2 cursor-pointer hover:!border-[#EAEAEA] hover:text-[#EAEAEA] font-semibold">Enviar</button> {/* Submit Button */}
                    
                    <p className="!text-xs !text-white">* Campo obrigatório</p>
                    
                    <input type="hidden" name="_template" value="table" /> {/* Email Template */}
                    <input type="hidden" name="_captcha" value="false" /> {/* ReCaptcha Remove */}
                </form>
                
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

                <div id="ModalErro" className="hidden">
                    <div className="conteudo">
                        <p>Por favor, selecione uma opção antes de enviar.</p>
                        <button id="FecharModal">OK</button>
                    </div>
                </div>
            </div>

            <hr className="text-white border-t-2 max-w-[1800px] mx-auto" />

            <div className="flex flex-col md:flex-row justify-evenly items-center gap-5 py-5 max-w-[1800px] mx-auto">
                <a href="/privicy.html" className="w-fit block hover:underline hover:text-[#EAEAEA]">
                    <h6>Politica de Privacidade</h6>
                </a>
                
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
