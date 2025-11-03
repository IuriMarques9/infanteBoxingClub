import Image from "next/image";
import { Card, CardTitle } from "../../../components/ui/card";
import Collection from "./Collection";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { useImagesFromFolder } from "@/hooks/use-imagesFromFolder";

interface CardCollectionProps {
  folderName: string;
}

export default function CardCollection(folderName: CardCollectionProps) {
	
	const nomePasta = folderName.folderName.split(':')[0];	// Remove qualquer sufixo após ':', para colocar o titulo
	const dataEvento = folderName.folderName.split(':')[1]; // Pega a data do evento, se existir
	const { images, loading, error } = useImagesFromFolder("galeriaEventos/" + folderName.folderName);
	
	const firstImage = images[0]?.url;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Card className="overflow-hidden cursor-pointer group relative text-white border-none shadow-2xl">
				{firstImage ? (
					<div className="relative h-80">
						<Image src={firstImage} alt={nomePasta} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
						<div className="absolute inset-0 bg-black/50" />
					</div>
				) : (
					<div className="relative h-80 bg-secondary">
						<div className="absolute inset-0 bg-black/50" />
					</div>
          		)}
				
					<div className="absolute inset-0 flex items-center justify-center p-4">
						<CardTitle className="font-headline text-4xl text-center drop-shadow-lg">{nomePasta}</CardTitle>
					</div>
				</Card>
				</DialogTrigger>
					<DialogContent className="max-w-4xl">
					<DialogHeader>
						<DialogTitle className="font-headline text-4xl mb-4">{nomePasta}</DialogTitle>
					</DialogHeader>

					<Collection images={images} />
			</DialogContent>
		</Dialog>
	);
}
