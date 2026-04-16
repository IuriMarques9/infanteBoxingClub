import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ImageData {
  id: string;
  url: string;
}

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
        const supabase = createClient();
        // Fetch list of files in the bucket under the specified folder
        const { data, error } = await supabase.storage.from('images').list(folder);

        if (error) throw error;
        if (!data) return;

        const imageList = data
          .filter(file => file.name !== '.emptyFolderPlaceholder' && !file.name.startsWith('.'))
          .map(file => {
            const { data: publicUrlData } = supabase.storage
              .from('images')
              .getPublicUrl(`${folder}/${file.name}`);
              
            return {
              id: file.id || file.name,
              url: publicUrlData.publicUrl
            };
          });

        setImages(imageList);
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