// ─── HELPER: BREADCRUMBLIST JSON-LD ─────────────────────────────
// Gera o objecto schema.org/BreadcrumbList que o Google usa para
// mostrar a navegação no rich snippet.
//
// Uso (numa server component page):
//
//   import { breadcrumbJsonLd } from '@/lib/seo/breadcrumb'
//   const ld = breadcrumbJsonLd(siteUrl, [
//     { name: 'Início', url: `/${lang}` },
//     { name: 'Sobre', url: `/${lang}/sobre` },
//   ])
//   return (
//     <>
//       <script type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
//       {/* resto da página */}
//     </>
//   )

export interface BreadcrumbItem {
  name: string
  /** Path absoluto (começa com `/`) ou URL completo. Será concatenado com siteUrl se for path. */
  url: string
}

export function breadcrumbJsonLd(siteUrl: string, items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  }
}
