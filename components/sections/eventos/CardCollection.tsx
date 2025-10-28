import Image from "next/image";
import { Card, CardTitle } from "../../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { useImagesFromFolder } from "@/hooks/use-imagesFromFolder";

interface CardCollectionProps {
  folderName: string;
}
export default function CardCollection(folderName: CardCollectionProps) {
	const nomePasta = folderName.folderName;
	const { images, loading, error } = useImagesFromFolder("galeriaEventos/" + nomePasta);

	const firstImage = images[0]?.url;

	console.log(firstImage);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Card className="overflow-hidden cursor-pointer group relative text-white border-none shadow-2xl">
					{firstImage && (
						<div className="relative h-80">
							<Image src={firstImage} alt={firstImage} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
							<div className="absolute inset-0 bg-black/50" />
						</div>)
					}
					<div className="absolute inset-0 flex items-center justify-center p-4">
						<CardTitle className="font-headline text-4xl text-center drop-shadow-lg">{nomePasta}</CardTitle>
					</div>
				</Card>
				</DialogTrigger>
					<DialogContent className="max-w-4xl">
					<DialogHeader>
						<DialogTitle className="font-headline text-4xl mb-4">{nomePasta}</DialogTitle>
					</DialogHeader>
				{/*
				<Carousel 
					className="w-full" 
					opts={{align: "start", loop: true,}}
					plugins={[
					Autoplay({
						delay: 4000,
						stopOnInteraction: true,
					})
					]}
				>
					<CarouselContent>
					{images.map(image => (
						<CarouselItem key={image.id} className="md:basis-1/2">
						<div className="overflow-hidden rounded-lg">
							<Image src={image.imageUrl} alt={image.description} width={600} height={400} className="w-full h-auto object-cover aspect-video" data-ai-hint={image.imageHint}/>
						</div>
						</CarouselItem>
					))}
					</CarouselContent>
					<CarouselPrevious className="hidden md:inline-flex" />
					<CarouselNext className="hidden md:inline-flex" />
				</Carousel>
				*/}
			</DialogContent>
		</Dialog>
	);
}
