import Image from "next/image";
import { ScrollArea } from "../../ui/scroll-area";
import  {ImageData} from "../../../interfaces/CloudinaryInterfaces";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import ImageDisplay from "@/components/templates/imageDisplay";

export default function Collection( { images }: { images: ImageData[] }) {
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  
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
            
            <ImageDisplay selectedImage={selectedImage} />
        </Dialog>
    </ScrollArea>
  );
}


