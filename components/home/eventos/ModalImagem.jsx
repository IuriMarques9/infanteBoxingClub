import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Download } from "lucide-react";
export default function ModalImagem({imagem, onClose}) {
    
    const [isLandscape, setIsLandscape] = useState(false);
        
    const cleanId = imagem.id.replace(/[^a-zA-Z0-9_-]/g, "");
    const downloadUrl = imagem.url.replace(`/upload/`, `/upload/fl_attachment:${cleanId}/`);

    console.log(imagem)
    useEffect(() => {
        if (imagem.width && imagem.height) {
        setIsLandscape(imagem.width > imagem.height);
        }
    }, [imagem.width, imagem.height]);
    

    return (
        <div className="fixed top-0 right-0 w-full h-screen bg-black/80 z-99 flex flex-col justify-center items-center">
            <Image className={`object-contain h-full ${isLandscape ? "rotate-90 md:rotate-0" : ""} `} src={imagem.url} width={imagem.width} height={imagem.height} alt={imagem.id}/>
            
            <X onClick={onClose} stroke="#837d7dff" className="absolute hover:scale-110 top-4 right-4 hover:cursor-pointer" />

            <a download href={downloadUrl} title="Baixar Fotografia" className="absolute top-4 left-4 p-2 bg-white rounded-full hover:opacity-80 cursor-pointer mx-auto flex gap-2 items-center text-[#CCA158]">
                <Download  size={24}/>
            </a>
        </div>
    );
}
