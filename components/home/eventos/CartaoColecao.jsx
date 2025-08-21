import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import Colecao from "./Colecao";
export default function CartaoColecao(collection) {
    
    const folderCollection = collection.colecao;
    
    const [imagesCollection,  setImagesCollection] = useState([]); //Inicializa a constante que vai guardar as imagens

    const [loading, setLoading] = useState(false); 

    const [isCollectionOpen, setIsCollectionOpen] = useState(false);//Inicializa a constante que vai definir de o display das imagens esta aberto
    const handleDownload = async () => {
        setLoading(true);

        const urls = imagesCollection.map(image => image.url);

        const res = await fetch("/api/cloudinaryImages/eventos/colecaoImagens/zipDownload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urls }),
        });

        if (!res.ok) {
        alert("Erro ao gerar o zip");
        setLoading(false);
        return;
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${folderCollection.title}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setLoading(false);
    };

    useEffect(() => {
        fetch(`api/cloudinaryImages/eventos/colecaoImagens?folder=${folderCollection.folderName}`)
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
                        <p>{folderCollection.date}</p>

                        <div className="flex items-center gap-4 w-full mt-8">
                            <Button onClick={() => setIsCollectionOpen(true)} className="bg-[#CCA158]">Ver Coleção</Button>
                            
                            {isCollectionOpen && (
                                <Colecao imagens={imagesCollection} onClose={() => setIsCollectionOpen(false)}/>
                            )}

                            <button
                                onClick={handleDownload} disabled={loading}
                                title={loading ? "A preparar ZIP..." : "Descarregar coleção"}
                                >
                                {loading ? <LoaderCircle stroke="#CCA158" className="animate-spin" /> : <Download className="hover:cursor-pointer hover:scale-110" stroke="#CCA158"/>}
                                    
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
