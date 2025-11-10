import archiver from 'archiver';
import stream from 'stream';
import { NextRequest } from 'next/server';
import fetch from 'node-fetch';


export async function POST(req: NextRequest) {
  try {
    const { publicIds } = (await req.json()) as { publicIds: string[] }

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Nenhum ID recebido.' }), { status: 400 })
    }

    if (publicIds.length > 100) {
      return new Response(JSON.stringify({ error: 'Limite máximo de 100 imagens.' }), { status: 413 })
    }

    // Cria stream para resposta
    const pass = new stream.PassThrough()
    const archive = archiver('zip', { zlib: { level: 9 } })
    archive.pipe(pass)

    // Gera URLs assinadas e faz fetch
    for (const [i, id] of publicIds.entries()) {
      try {
        // Gera URL segura (expira em 1h)
        const signedUrl = cloudinary.url(id, {
          type: 'authenticated', // usa "upload" se forem públicas
          sign_url: true,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          secure: true,
          format: 'jpg', // ou deixa automático
        })

        const res = await fetch(signedUrl)
        if (!res.ok) throw new Error(`Falha ao obter imagem ${id}`)
        const buffer = Buffer.from(await res.arrayBuffer())
        archive.append(buffer, { name: `${id.split('/').pop() || `imagem_${i + 1}`}.jpg` })
      } catch (err) {
        console.error('Erro ao processar imagem:', id, err)
      }
    }

    archive.finalize()

    return new Response(pass, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="galeria.zip"',
      },
    })
  } catch (err) {
    console.error('Erro geral:', err)
    return new Response(JSON.stringify({ error: 'Erro interno no servidor.' }), { status: 500 })
  }
}