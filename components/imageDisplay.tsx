"use client";
import Image from "next/image";
import  {ImageData} from "../interfaces/CloudinaryInterfaces";
import { DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

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
                    <Button className="text-white">
                        <Download className="mr-2 h-4 w-4" />
                            Download
                    </Button>
                </div>
            </DialogContent>
        )}
    </div>
);
}
