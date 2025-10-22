import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    
    if (!folder) {
        return NextResponse.json({ error: 'Parâmetro "folder" é obrigatório.' }, { status: 400 });
    }

    try {
        const result = await cloudinary.api.resources_by_asset_folder(
            'Trabalho/Infante Boxing Club/fotos/' + folder, 
            {
                max_results: 100, 
                context: true
            });


        const images = result.resources.map(r => ({
            id: r.public_id,
            url: r.secure_url,
            width: r.width,
            height: r.height,
        }));

        return NextResponse.json(images);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}