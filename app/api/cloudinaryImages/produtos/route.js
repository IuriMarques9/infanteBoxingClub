import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
    try {
        const result = await cloudinary.api.resources_by_asset_folder(
            'Trabalho/Infante Boxing Club/fotos/produtos',
            {max_results: 100}
        );

        const produtos = result.resources.map((prod) => ({
            id: prod.public_id,
            url: prod.secure_url,
            width: prod.width,
            height: prod.height,
            context: prod.context.custom, // Context can include additional metadata like title, description, price
        }));

        return NextResponse.json(produtos);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Falha ao buscar produtos" }, { status: 500 });
    }
}