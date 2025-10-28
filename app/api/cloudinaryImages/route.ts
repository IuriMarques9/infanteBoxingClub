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


        const images = result.resources.map(r => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const custom = (r.context as any)?.custom || {};
            return {
                id: r.public_id,
                url: r.secure_url,
                width: r.width,
                height: r.height,
                context: {
                    custom: {
                        caption: custom.caption || "",
                        date: custom.Data || "",
                        paragrafo: custom.Paragrafo || "",
                        linkEvento: custom.LinkEvento || "",
                        localizacao: custom.Localizacao || "",
                        preco: custom['Preço'] || "",
                    }
                },
            };
        });

        return NextResponse.json(images);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}