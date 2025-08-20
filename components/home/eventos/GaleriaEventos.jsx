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
import Colecao from "./Colecao";

export default function GaleriaEventos() {
    const [collections, setCollections] = useState(null);// Estado para guardar proximo coleções
    
    useEffect(() => {
            fetch('api/cloudinaryImages/eventos/galeriaEventos')
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    const folders = data.folders.map((folder) => ({
                        id: folder.external_id,
                        title: folder.name,
                        path: folder.path,
                    }));

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
                        <CarouselItem key={folderCollection.id} className="sm:basis-2/3 lg:basis-1/3">
                            
                            <Colecao colecao={folderCollection} />
                            
                        </CarouselItem>
                    ))
                    }
                </CarouselContent>

                <CarouselPrevious />
                <CarouselNext />

            </Carousel>
        </div>
    );
}