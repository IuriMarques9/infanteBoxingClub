import JSZip from "jszip";
import fetch from "node-fetch";

export async function POST(req) {
  try {
    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response("Lista de URLs inválida", { status: 400 });
    }

    const zip = new JSZip();

    for (let i = 0; i < urls.length; i++) {
      const res = await fetch(urls[i]);
      if (!res.ok) throw new Error(`Erro ao baixar: ${urls[i]}`);

      const buffer = await res.arrayBuffer();

      // Pega o nome do ficheiro a partir da URL ou cria um genérico
      const urlParts = urls[i].split("/");
      const fileName = urlParts[urlParts.length - 1] || `imagem${i + 1}.jpg`;

      zip.file(fileName, buffer);
    }

    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    return new Response(zipContent, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=imagens.zip",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Erro ao gerar o zip", { status: 500 });
  }
}