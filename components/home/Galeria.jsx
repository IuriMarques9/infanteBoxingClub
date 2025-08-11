"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import ImagemGaleria from "./ImagemGaleria";
import { ArrowDown,ArrowUp } from "lucide-react";

export default function Galeria() {
    const [images, setImages] = useState([]);// Estado para guardar imagens
    const [showAll, setShowAll] = useState(false);

    const toggleShowAll = () => {
        setShowAll((prev) => !prev);
    };
    const imagesToShow = showAll ? images : images.slice(0, 10);

    useEffect(() => {
        fetch('api/cloudinaryImages/galeria')
            .then(res => res.json())
            .then(data => setImages(data))
            .catch(err => console.error("Failed to fetch galary images:", err));
    }, []);

    if (!images.length) return <p>Carregando imagens...</p>;

    return (
        <section id="Galeria" className="max-w-[1800px] mx-auto relative h-fit p-5 md:px-10 flex flex-col gap-15">
                <div className="border-b-4 border-[#CCA158]">
                    <h2>Galeria de fotos</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mx-auto"> {/*Imagens visiveis*/}
                    {
                        imagesToShow.map(img => (
                            <ImagemGaleria key={img.id} id={img.id} url={img.url} width={img.width} height={img.height} />
                        ))
                    }
                </div> 
                
                {
                    images.length > 10 && (
                        <div id="SeeMoreButton" className={` ${showAll ? 'bottom-0' : 'absolute bottom-50 h-50'} inset-x-0  px-[35px]`}> {/*Botão 'Ver Mais'*/}
                            <div className={`flex flex-col justify-center items-center bg-gradient-to-b from-white/1 from-10% via-white via-70% to-white to-100% w-full ${showAll ? 'h-10': 'h-100'}`}>
                                <div onClick={toggleShowAll} className="flex flex-col items-center cursor-pointer hover:scale-105">

                                    {showAll ? 
                                       (
                                            <>
                                                <h5>Esconder</h5>
                                                <ArrowUp stroke="#CCA158" />
                                            </>
                                        ) : (
                                            <>
                                                <h5>Ver mais</h5>
                                                <ArrowDown stroke="#CCA158" />
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            </section>
    );
}
