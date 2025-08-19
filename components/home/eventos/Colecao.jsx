import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react";

export default function Colecao(collection) {
    
    const folderCollection = collection.colecao;
    
    const [imagesCollection,  setImagesCollection] = useState([]);

    useEffect(() => {
        console.log("Chamando com folder:", folderCollection.title);
        fetch(`api/cloudinaryImages/eventos/colecaoImagens?folder=${folderCollection.title}`)
            .then(res => res.json())
            .then(data => {setImagesCollection(data)})
            .catch(err => console.error("Failed to fetch images:", err));
    }, []);

    console.log(imagesCollection)
    return(
        <div className="">
            <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image className="w-2/4" src={imagesCollection.resources.url} width={imagesCollection.resources.width} height={imagesCollection.resources.height} alt={imagesCollection.resources.display_name} />
                    <h4 className="!text-[#CCA158]">{folderCollection.title}</h4>
                </CardContent>
            </Card>
        </div>
    );
}
