import { NextResponse } from "next/server";
import cloudinary from "../../../../../lib/cloudinary";

export async function GET() {
    try {
        const result = await cloudinary.api.resources_by_asset_folder(
            'Trabalho/Infante Boxing Club/fotos/proximoEvento',
            {max_results: 100}
        );


        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Falha ao buscar proximo evento" }, { status: 500 });
    }
}