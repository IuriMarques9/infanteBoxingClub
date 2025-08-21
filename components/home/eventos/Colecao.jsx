"use client"
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";
import ModalImagem from "./ModalImagem";
export default function Colecao({imagens, onClose}) {
    

    const [isImageOpen, setIsImageOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    
    useEffect(() => { //Evita o scroll
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto"; // repõe quando fecha
        };
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-16">
            <X onClick={onClose} className="absolute top-6 right-6 hover:cursor-pointer hover:scale-110" width="25" height="25" fill="transparent" stroke="#837d7dff" />							
            
            <div className="relative w-full max-w-2xl overflow-y-auto max-h-[90vh] overflow-x-hidden">                
            
                <div className="grid items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {imagens.map((img) => (
                        <div key={img.id}>
                            <Image className="hover:scale-105 hover:grayscale-40 hover:cursor-pointer" onClick={() => {setIsImageOpen(true); setSelectedImage(img)}} src={img.url} height={img.height} width={img.width} alt="foto da coleção"/>
                            
                        </div>
                    ))}
                </div>
            </div>
            {/*Modal da imagem selecionada */}
            {isImageOpen && <ModalImagem imagem={selectedImage} onClose={() => setIsImageOpen(false)}/>}
        </div>,
        document.body
    );
}
