"use client";
import Image from "next/image";
import  {ImageData} from "../interfaces/CloudinaryInterfaces";
import { DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Link from "next/link";

interface Props {
  selectedImage: ImageData | null
}

export default function ImageDisplay( {selectedImage} : Props ) {

return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {selectedImage && (
            <DialogContent className="max-w-4xl p-2">
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
                    <Link href={`https://res.cloudinary.com/dxwqodv1x/image/upload/fl_attachment/` + selectedImage.id}>
                        <Button className="text-white">
                            <Download className="h-4 w-4" /> 
                        </Button>
                    </Link>
                </div>
            </DialogContent>
        )}  
    </div>
);
}
