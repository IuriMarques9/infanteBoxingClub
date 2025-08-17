import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Download } from "lucide-react"; // Importando o ícone de fechar
export default function ImagemGaleria(props) {
    const [isOpen, setIsOpen] = useState(false);// Estado para controlar a exibição das fotos
    const [isLandscape, setIsLandscape] = useState(false);

    const downloadUrl = props.url.replace(`/upload/`, `/upload/fl_attachment:${props.id}/`);

    useEffect(() => {
        if (props.width && props.height) {
        setIsLandscape(props.width > props.height);
        }
    }, [props.width, props.height]);

    useEffect(() => {
        if (isOpen) {
            // Bloqueia o scroll da página
            document.body.style.overflow = "hidden";
        } else {
            // Restaura o scroll da página
            document.body.style.overflow = "";
        }

        // Limpa o efeito ao desmontar o componente (segurança)
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);
    
    return (
        <div className="overflow-hidden w-full h-fit place-self-center">
            <Image
                src={props.url}
                alt={props.id}
                width={400}
                height={400}
                className="max-w-80 w-full h-full object-contain hover:cursor-pointer hover:brightness-70"
                onClick={() => setIsOpen(true)}
            />

            {/* Modal para exibir a imagem em tamanho maior */}
            {
                isOpen && 
                (<div className="fixed top-0 right-0 w-full h-screen bg-black/80 z-99 flex flex-col justify-center items-center">
                    <X onClick={() => setIsOpen(false)} stroke="#837d7dff" className="absolute hover:scale-110 top-4 right-4 text- text-3xl hover:cursor-pointer" />

                    <Image width={props.width} height={props.height} src={props.url} alt={props.id} className={`object-contain h-full ${isLandscape ? "rotate-90 md:rotate-0" : ""} `}/>
                    
                    <a download href={downloadUrl} className="absolute top-8 left-8 p-2 bg-white rounded-full hover:opacity-80 cursor-pointer mx-auto flex gap-2 items-center text-[#CCA158]">
                        <Download size={30}/>
                    </a>
                
                </div>)
            }                   
        </div>
    );
}