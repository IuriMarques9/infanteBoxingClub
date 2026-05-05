'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// ─── BARRA DE PROGRESSO DE NAVEGAÇÃO ────────────────────────────
// Aparece no topo do ecrã imediatamente quando o utilizador clica
// em qualquer link interno e desaparece quando a nova rota termina
// de carregar. Resolve a percepção de "lentidão" em rotas com queries
// pesadas (ex: ficha de membro, dashboard).
//
// Implementação:
//   1. Listener global de cliques: detecta <a> ou <Link> interno
//      → activa a barra de loading.
//   2. Hook usePathname/useSearchParams: quando muda, navegação
//      terminou → desactiva a barra com delay para fade-out suave.
//
// Sem dependências externas (NProgress, etc).

export default function RouteProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [active, setActive] = useState(false)

  // Esconder quando navegação terminar (pathname/searchParams mudam)
  useEffect(() => {
    if (!active) return
    // Pequeno delay para a animação de "completar" ser visível.
    const t = setTimeout(() => setActive(false), 200)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()])

  // Detectar cliques em links internos
  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Modificadores do utilizador → deixar o browser fazer o seu (abrir noutra tab, etc)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return

      const anchor = (e.target as HTMLElement | null)?.closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href) return
      // Externos / âncoras / mailto / tel → ignorar
      if (href.startsWith('http') || href.startsWith('//') || href.startsWith('#')
          || href.startsWith('mailto:') || href.startsWith('tel:')) return
      // target=_blank ou download → o browser abre nova tab/janela
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return
      // Mesmo path (sem mudança real) → ignorar
      const currentFull = pathname + (searchParams?.toString() ? `?${searchParams}` : '')
      if (href === pathname || href === currentFull) return

      setActive(true)
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true } as any)
  }, [pathname, searchParams])

  if (!active) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none overflow-hidden"
      role="progressbar"
      aria-label="A carregar página"
    >
      <div className="route-progress-bar h-full bg-[#E8B55B] shadow-[0_0_10px_rgba(232,181,91,0.7)]" />
      <style>{`
        .route-progress-bar {
          width: 30%;
          animation: route-progress 1s ease-in-out infinite;
        }
        @keyframes route-progress {
          0%   { transform: translateX(-100%); width: 30%; }
          50%  { width: 60%; }
          100% { transform: translateX(350%); width: 30%; }
        }
      `}</style>
    </div>
  )
}
