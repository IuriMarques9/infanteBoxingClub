import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    
    if (!folder) {
        return NextResponse.json({ error: 'Parâmetro "folder" é obrigatório.' }, { status: 400 });
    }

    try {
        const result = await cloudinary.api.sub_folders('Trabalho/Infante Boxing Club/fotos/' + folder); 
        
        const pastas = result.folders.map((folder: { name: string; path: string; external_id: string}) => ({
            name: folder.name,
            path: folder.path,
            external_id: folder.external_id,
        }));

        return NextResponse.json(pastas);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}