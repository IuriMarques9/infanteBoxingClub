import { NextResponse } from "next/server";
import cloudinary from "../../../../../lib/cloudinary";

export async function GET() {
    try {
        const result = await cloudinary.api.sub_folders(
            'Trabalho/Infante Boxing Club/fotos/galeriaEventos',
            {max_results: 20}
        );


        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Falha ao buscar pastas" }, { status: 500 });
    }
}