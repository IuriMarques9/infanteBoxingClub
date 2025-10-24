export interface ImageData {
  id: string;
  url: string;
  width?: number;
  height?: number;
  context?: {
    custom?: {
      title?: string;
      date?: string;
      paragrafo?: string;
      linkEvento?: string;
      localizacao?: string;
    };
  };
}
