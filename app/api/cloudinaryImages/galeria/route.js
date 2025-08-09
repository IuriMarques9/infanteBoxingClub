import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
    try {
        const result = await cloudinary.api.resources_by_asset_folder('Trabalho/Infante Boxing Club/fotos/galeria');

        const images = result.resources.map((image) => ({
            id: image.public_id,
            url: image.secure_url,
            width: image.width,
            height: image.height,
        }));

        return NextResponse.json(images);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Falha ao buscar imagens" }, { status: 500 });
    }
}