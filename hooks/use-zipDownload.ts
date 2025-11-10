'use client'

import { useState } from 'react'
import { ImageData } from '@/interfaces/CloudinaryInterfaces'

interface UseDownloadGalleryReturn {
  loadingZip: boolean
  errorZip: string | null
  downloadGallery: (images: ImageData[], filename?: string) => Promise<void>
}

export function useZipDownload(): UseDownloadGalleryReturn {
  const [loadingZip, setLoadingZip] = useState(false)
  const [errorZip, setErrorZip] = useState<string | null>(null)

  async function downloadGallery(images: ImageData[], filename = 'galeria.zip') {
    if (!images || images.length === 0) return
    setLoadingZip(true)
    setErrorZip(null)

    const urls = images.map(imagem => imagem.url);

    try {
      const res = await fetch('/api/zipFolder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {urls} ),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'Erro no download')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      setErrorZip(err.message || 'Erro inesperado')
    } finally {
      setLoadingZip(false)
    }
  }

  return { loadingZip, errorZip, downloadGallery }
}
