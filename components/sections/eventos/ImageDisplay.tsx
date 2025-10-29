import Image from "next/image";
import { ScrollArea } from "../../../components/ui/scroll-area";
import  {ImageData} from "../../../interfaces/CloudinaryInterfaces";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";

export default function ImageGallery( { images }: { images: ImageData[] }) {
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  
    const handleDownload = (image: ImageData) => {
        //ACABAR O BOTAO DE DOWNLOAD
    };
  
  if (images.length === 0) {
    return <p className="text-muted-foreground text-center">Ainda não há imagens nesta coleção.</p>;
  }
  
  return (
    <ScrollArea className="h-full">
        <Dialog>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[70vh]">
            {images.map(image => (
                <DialogTrigger asChild key={image.id} onClick={() => setSelectedImage(image)}>
                    <Image 
                        src={image.url} 
                        alt={image.id} 
                        width={400} 
                        height={400} 
                        className="w-full h-full object-cover aspect-square transition-all duration-300 hover:brightness-75 cursor-pointer" 
                    />
                </DialogTrigger>
            ))}
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedImage && (
                    <DialogContent aria-describedby="image" className="max-w-4xl p-2">
                    <DialogPrimitive.DialogTitle />
                        <div className="relative aspect-video">
                            <Image
                                src={selectedImage.url}
                                alt={selectedImage.id}
                                fill
                                className="object-contain rounded-md"
                                />
                        </div>
                        <div className="flex justify-end p-2">
                            <Button onClick={() => handleDownload(selectedImage)}>
                            <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </div>
                    </DialogContent>
                )}
            </div>
        </Dialog>
    </ScrollArea>
  );
}


