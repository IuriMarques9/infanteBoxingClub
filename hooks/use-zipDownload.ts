'use client'

import { useState } from 'react'

interface UseDownloadGalleryReturn {
  loading: boolean
  error: string | null
  downloadGallery: (publicIds: string[], filename?: string) => Promise<void>
}

export function useZipDownload(): UseDownloadGalleryReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function downloadGallery(publicIds: string[], filename = 'galeria.zip') {
    if (!publicIds?.length) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/zipFolder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicIds }),
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
      setError(err.message || 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, downloadGallery }
}
