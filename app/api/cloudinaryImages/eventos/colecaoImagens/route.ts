import { NextResponse } from "next/server";
import cloudinary from "../../../../../lib/cloudinary";

export async function GET(request, { params }) {
    const folder = params?.folder || request.nextUrl.searchParams.get("folder");

    if (!folder) {
        return NextResponse.json({ error: 'Falta o parâmetro "folder"' }, { status: 400 });
    }

    try {
        const result = await cloudinary.api.resources_by_asset_folder(
            `Trabalho/Infante Boxing Club/fotos/galeriaEventos/${folder}`,
            {max_results: 100}
        );


        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Falha ao buscar fotos do evento" }, { status: 500 });
    }
}