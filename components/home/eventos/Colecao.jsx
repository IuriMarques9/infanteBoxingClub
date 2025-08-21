"use client"
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import Image from "next/image";
export default function Colecao({imagens, onClose}) {
    
    console.log(imagens)

    useEffect(() => { //Evita o scroll
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto"; // repõe quando fecha
        };
    }, []);

    return createPortal(
        <div className="md:py-20 pt-10 pb-40 sm:px-40 bg-black/70 backdrop-blur-xs fixed top-0 left-0 z-99 w-full h-screen">
            <div className="mb-5 overflow-auto w-full h-full mx-auto grid content-start md:content-center gap-5 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                {imagens.map((img) => {
                    <Image src={img.url} height={img.height} width={img.width}/>
                })}
            </div>

            <X onClick={onClose} className="flex-none hover:cursor-pointer hover:scale-110" width="25" height="25" fill="transparent" stroke="#837d7dff" />							
        </div>,
        document.body
    );
}
