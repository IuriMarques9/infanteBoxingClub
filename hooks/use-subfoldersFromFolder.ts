import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface FolderData {
  name: string;
  external_id: string;
}

export const useSubfoldersFromFolder = (folder: string) => {
  const [pastas, setPastas] = useState<FolderData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPastas = async () => {
      if(!folder) return;
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        // Em supabase, list retorna ficheiros e "pastas". Pastas não têm id
        const { data, error } = await supabase.storage.from('images').list(folder);
        
        if (error) {
          throw error;
        }

        // Filtra os que parecem ser pastas (sem id ou metadados de ficheiro) e evita ficheiros escondidos
        const folderList = data
          .filter(item => !item.id && !item.name.startsWith('.'))
          .map(item => ({
             name: item.name,
             external_id: item.name
          }));
          
        setPastas(folderList);
        
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