export interface ImageData {
  id: string;
  url: string;
  width?: number;
  height?: number;
  title: string;
  context: { [key: string]: string };
}
