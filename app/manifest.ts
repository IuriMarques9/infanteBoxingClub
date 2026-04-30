import type { MetadataRoute } from 'next'

// ─── PWA MANIFEST ────────────────────────────────────────────────
// Gerado em /manifest.webmanifest pelo Next.js. Permite instalar o
// site como app no iOS/Android/desktop, controla cor de splash e
// é usado pelo Lighthouse para o score "PWA".

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Infante Boxing Club — Ginásio de Boxe em Olhão',
    short_name: 'Infante Boxing',
    description:
      'Ginásio de boxe em Olhão. Boxe de competição, manutenção e educativo. Filiados na Federação Portuguesa de Boxe.',
    start_url: '/pt',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0A0A0A',
    theme_color: '#E8B55B',
    lang: 'pt-PT',
    categories: ['sports', 'health', 'fitness'],
    icons: [
      {
        src: '/infanteLogo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/infanteLogoSemFundo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
