"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";


export default function ProximoEvento() {
    
    
    // This component will render the products available in the store
    const [nextEvent, setNextEvents] = useState(null);// Estado para guardar proximo evento
       
    useEffect(() => {
        fetch('api/cloudinaryImages/proximoEvento')
            .then(res => res.json())
            .then(data => { 
                const img = data.resources[0]

                const evento = {
                    context: {
                        title: img.context?.custom.caption || "Titulo do Evento",
                        date: img.context?.custom.Data || "Data indisponivel",
                        paragrafo: img.context?.custom.Paragrafo || "Descrição do evento indisponivel",
                    },
                    url: img.url,
                    id: img.public_id,
                    width: img.width,
                    height: img.height
                }
                
                setNextEvents(evento)
            })
            
            
            .catch(err => console.error("Failed to fetch next event:", err));
        }, []);
        
        if (!nextEvent) {
            return <LoaderCircle className="col-start-3 animate-spin text-[#CCA158] w-10 h-10 mx-auto mt-20" /> 
        };
    
    return (
        <div className="w-full h-fit flex">
            <Image src={nextEvent.url} height={nextEvent.height} width={nextEvent.width} alt={nextEvent.context.title} className="w-1/4"/>

            <div className="w-3/4 h-fit p-3">
                <h5>{nextEvent.context.title}</h5>
                <h6 className="!text-black">{nextEvent.context.date}</h6>
                <p>{nextEvent.context.paragrafo}</p>
            </div>

        </div>
    );
}