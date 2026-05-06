'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// O <main> da dashboard tem `overflow-auto` (scroll próprio).
// O scroll-to-top default do Next só reseta o window, não containers
// internos — sem isto, mudar de tab mantinha a posição de scroll da
// tab anterior. Procura o ancestral scrollável mais próximo e zera-o.
export default function ScrollResetOnRoute() {
  const pathname = usePathname()

  useEffect(() => {
    const main = document.querySelector('main')
    if (main) main.scrollTop = 0
  }, [pathname])

  return null
}
