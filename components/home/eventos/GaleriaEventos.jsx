"use client"
import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { LoaderCircle } from "lucide-react";
import CartaoColecao from "./CartaoColecao";

export default function GaleriaEventos() {
    const [collections, setCollections] = useState(null);// Estado para guardar proximo coleções
    
    useEffect(() => {
            fetch('api/cloudinaryImages/eventos/galeriaEventos')
                .then(res => res.json())
                .then(data => {
                    
                    const folders = data.folders.map((folder) => {
                        
                        const [titlePart, dateString] = folder.name.split('-', 2);

                        let formattedDate = '';
                        if (dateString && dateString.length === 8) {
                            const day = Number(dateString.slice(0, 2));
                            const month = Number(dateString.slice(2, 4)) - 1; // meses são baseados em 0
                            const year = Number(dateString.slice(4));

                            const dateObj = new Date(year, month, day);

                            formattedDate = dateObj.toLocaleDateString('pt-PT', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            });

                        return {
                            id: folder.external_id,
                            folderName: folder.name,
                            title: titlePart,
                            date: formattedDate,
                            path: folder.path,
                        }
                    }});

                    setCollections(folders)
                })
                .catch(err => console.error("Failed to fetch folders:", err));
            }, []);

        if (!collections) {
            return <LoaderCircle className="col-start-3 animate-spin text-[#CCA158] w-10 h-10 mx-auto mt-20" /> 
        };


    return (
        <div className="rounded-xs bg-[#EAEAEA] p-6">
            <h3 className="!text-[#CCA158] mb-8">Galeria de Eventos</h3>

            <Carousel className="w-full">

                <CarouselContent className="mb-2">
                    {collections.map((folderCollection) => (
                        <CarouselItem key={folderCollection.id} className="sm:basis-2/3 xl:basis-1/3">
                            
                            <CartaoColecao colecao={folderCollection} />
                            
                        </CarouselItem>
                    ))
                    }
                </CarouselContent>

            <div className="flex gap-1">
                <CarouselPrevious className="hover:bg-[#CCA158]"/>
                <CarouselNext className="hover:bg-[#CCA158]"/>
            </div>

            </Carousel>
        </div>
    );
}