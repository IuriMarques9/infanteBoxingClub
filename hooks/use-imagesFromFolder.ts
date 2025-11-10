import {useState, useEffect} from 'react';
import { ImageData } from '../interfaces/CloudinaryInterfaces';

export function useImagesFromFolder(folder: string) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
	if (!folder) return;

    async function fetchImages() {
		setLoading(true);
		setError(null);

      	try {
			const res = await fetch(`/api/cloudinaryImages?folder=${encodeURIComponent(folder)}`);

			if (!res.ok) throw new Error(`Erro ao buscar: ${res.status}`);

			const data: ImageData[] = await res.json();

			setImages(data);

      	} catch (err: any) {
        	setError(err.message);
      	} finally {
        	setLoading(false);
      	}
    }

    fetchImages();
  }, [folder]);
  return { images, loading, error };
}