import archiver from 'archiver';
import stream from 'stream';
import { NextRequest } from 'next/server';
import fetch from 'node-fetch';

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { urls } = (await req.json()) as { urls: string[] };

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ error: 'Nenhuma URL recebida.' }), { status: 400 });
    }

    const pass = new stream.PassThrough();
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(pass);

    for (const [i, url] of urls.entries()) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Falha ao obter imagem ${url}`);
        const buffer = Buffer.from(await res.arrayBuffer());

        // Extrai nome do arquivo da URL ou gera um nome genérico
        const nameFromUrl = url.split('/').pop()?.split('?')[0] || `imagem_${i + 1}.jpg`;
        archive.append(buffer, { name: nameFromUrl });
      } catch (err) {
        console.error('Erro ao processar imagem:', url, err);
      }
    }

    archive.finalize();

    return new Response(pass as any, {
      headers: {
        'Content-Type': 'application/zip',
      },
    });
  } catch (err) {
    console.error('Erro geral:', err);
    return new Response(JSON.stringify({ error: 'Erro interno no servidor.' }), { status: 500 });
  }
}
