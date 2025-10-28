export interface ImageData {
  id: string;
  url: string;
  width?: number;
  height?: number;
  context?: {
    custom?: {
      caption?: string;
      date?: string;
      paragrafo?: string;
      linkEvento?: string;
      localizacao?: string;
      preco?: string;
    };
  };
}

export interface FolderData {
  name: string;
  path: string;
  external_id: string;
}
