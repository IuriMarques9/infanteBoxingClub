import { useEffect, useState } from 'react';
import {FolderData} from "../interfaces/CloudinaryInterfaces";

export const useSubfoldersFromFolder = (folder: string) => {
  const [pastas, setPastas] = useState<FolderData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPastas = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/cloudinaryFolders?folder=${encodeURIComponent(folder)}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar pastas');
        }
        const data: FolderData[] = await response.json();
        setPastas(data);
        
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchPastas();
  }, [folder]);

  return { pastas, loading, error };
};