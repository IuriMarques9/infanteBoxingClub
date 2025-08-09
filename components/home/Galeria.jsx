"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
export default function Galeria() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch('api/cloudinaryImages/galeria')
            .then(res => res.json())
            .then(data => setImages(data))
            .catch(err => console.error("Failed to fetch galary images:", err));
    }, []);

    if (!images.length) return <p>Carregando imagens...</p>;

    console.log(images);
    return (
        <section id="Galeria" className="max-w-[1800px] mx-auto relative h-fit p-5 md:px-10 flex flex-col gap-15">
                <div className="border-b-4 border-[#CCA158]">
                    <h2>Galeria de fotos</h2>
                </div>
                
                <div className="flex flex-col md:flex-row w-full items-center justify-center gap-5"> {/*Imagens visiveis*/}
                    {
                        images.map(img => (
                            <Image
                                key={img.id}
                                src={img.url}
                                alt={img.id}
                                width={150}
                                height={150}
                                className="rounded shadow"
                            />
                        ))
                    }
                </div> 

                <div id="SeeMoreButton" className="absolute inset-x-0 bottom-0 h-50 px-[35px]"> {/*Botão 'Ver Mais'*/}
                    <div className="flex flex-col justify-center items-center bg-gradient-to-b from-white/1 from-10% via-white via-70% to-white to-100% w-full h-50">
                        <div className="cursor-pointer hover:scale-105">
                            <h5>Ver mais</h5>

                            <a href="/galeria.html">
                                <svg className="mx-auto hover:!scale-100" width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 10L12 15L17 10" stroke="#CCA158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
    );
}
