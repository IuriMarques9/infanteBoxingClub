import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
export default function Colecao(collection) {
    
    const folderCollection = collection.colecao;
    
    const [imagesCollection,  setImagesCollection] = useState([]);

    useEffect(() => {
        fetch(`api/cloudinaryImages/eventos/colecaoImagens?folder=${folderCollection.title}`)
            .then(res => res.json())
            .then(data => {
                
                const imagem = data.resources.map(data => ({
                    id: data.public_id,
                    url: data.url,
                    width: data.width,
                    height: data.height
                }));
                
                setImagesCollection(imagem)})
            .catch(err => console.error("Failed to fetch images:", err));
    }, []);

    console.log(imagesCollection)
    

    return(
        <div className="">
            <Card className="py-0">
                <CardContent className="flex items-center justify-evenly gap-5 p-6">
                    {imagesCollection?.length > 0 && ( 
                        <div className="aspect-square size-35">
                            <Image className="object-fill h-full" src={imagesCollection[0].url} alt={folderCollection.title} height={imagesCollection[0].height} width={imagesCollection[0].width} />
                        </div>
                    )}

                    <div className="flex flex-col w-fit">
                        <h5 className="!text-[#CCA158]">{folderCollection.title}</h5>
                        <p>{folderCollection.date}123</p>

                        <div className="flex items-center gap-4 w-full mt-8">
                            <Button className="bg-[#CCA158]">Ver Coleção</Button>
                            <Download stroke="#CCA158"/>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
