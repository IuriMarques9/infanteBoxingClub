"use client"
import { useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

export default function EmailForm() {
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // evita recarregar a página
        
        if (!isChecked) {
            toast.error("Por favor, aceite os termos!");
            return;
        }
        
        setIsLoading(true);

        try {
            const formData = new FormData(e.target);
            const response = await fetch("https://formsubmit.co/e5147151c2d64e4ceaf0a9c445101848", {
                method: "POST",
                body: formData,
            });

            if (response.ok){
                toast.success('Formulário enviado com sucesso!');
                e.target.reset();
                setIsChecked(false);
            } else {
                alert("Houve um erro. Tenta novamente.");
            }
        } catch (error) {
            toast.error("Erro de rede. Verifique a sua ligação.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full text-white flex flex-col gap-2">
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
                <label htmlFor="CheckBox" className="container flex items-center gap-1">
                    <input
                        id="CheckBox"
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        className="h-fit"
                        name="politica"
                    />
                    <span className="checkmark"></span>
                    <span className="text-[0.8em]">Concordo com a </span>
                </label>
                <a href="/privicy.html" className="font-[600] text-[0.8em] underline hover:text-[#EAEAEA]">Politica de Privacidade</a> *
            </div>
    
            {/* Submit Button */}
            <button disabled={isLoading} type="submit" value="Enviar" className="py-2 cursor-pointer hover:!border-[#EAEAEA] hover:text-[#EAEAEA] font-semibold">
                {isLoading ? "Enviando..." : "Enviar"}
            </button> 
            
            <p className="!text-xs !text-white">* Campo obrigatório</p>
            
            {/* Campos ocultos do FormSubmit */}
            <input type="hidden" name="_template" value="table" /> {/* Email Template */}
            <input type="hidden" name="_captcha" value="false" /> {/* ReCaptcha Remove */}

            {/* Container das notificações */}
            <ToastContainer
                position="top-right" // posição do alerta
                autoClose={3000} // fecha em ms
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" // "light" | "dark" | "colored"
            />
        </form>
    );
}
