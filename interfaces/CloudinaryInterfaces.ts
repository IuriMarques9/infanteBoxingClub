// ─── INTERFACE DE DADOS DE IMAGEM ───────────────────────────────
// Tipo utilizado em componentes legados (Collection, imageDisplay, zipDownload)
// e no carrossel da Loja para imagens armazenadas no Supabase Storage.

export interface ImageData {
  id: string;
  url: string;
  context?: {
    custom?: {
      caption?: string;
      preco?: string;
      [key: string]: string | undefined;
    };
  };
}
