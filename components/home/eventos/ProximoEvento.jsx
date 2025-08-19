"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProximoEvento() {
    
    
    // This component will render the products available in the store
    const [nextEvent, setNextEvents] = useState(null);// Estado para guardar proximo evento
       
    useEffect(() => {
        fetch('api/cloudinaryImages/eventos/proximoEvento')
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
        <>
            <Card className="max-w-100 md:max-w-none mx-auto md:mx-none w-full">
                <CardHeader className="flex flex-col md:flex-row items-center">
                    <Image src={nextEvent.url} height={nextEvent.height/4} width={nextEvent.width/4} alt={nextEvent.context.title} className=""/>
                    <div className="flex flex-col gap-8 p-3 w-full">
                        <div>
                            <CardTitle className="text-3xl text-[#CCA158]">{nextEvent.context.title}</CardTitle>
                            <CardDescription>{nextEvent.context.date}</CardDescription>
                        </div>
                        <p className="!text-sm lg:!text-base !text-black text-justify">{nextEvent.context.paragrafo}</p>
                    </div>
                </CardHeader>
            </Card> 
        </>
    );
}