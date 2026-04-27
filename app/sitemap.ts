import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://infanteboxingclub.pt";

// ─── SITEMAP COM HREFLANG (PT/EN) ──────────────────────────────
// Cada rota é listada nas duas línguas (pt-PT e en-US) com
// `alternates.languages` para o Google indexar correctamente
// ambas as versões. Submeter no Search Console para crawl rápido.

const ROUTES: { path: string; priority: number; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' }[] = [
  { path: '',                priority: 1.0, changeFrequency: 'weekly' },
  { path: '/sobre',          priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contacto',       priority: 0.9, changeFrequency: 'monthly' },
  { path: '/privacy-policy', priority: 0.2, changeFrequency: 'yearly' },
]

const LOCALES = ['pt', 'en'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []
  for (const r of ROUTES) {
    for (const lang of LOCALES) {
      const url = `${siteUrl}/${lang}${r.path}`
      entries.push({
        url,
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
        alternates: {
          languages: {
            'pt-PT':     `${siteUrl}/pt${r.path}`,
            'en-US':     `${siteUrl}/en${r.path}`,
            'x-default': `${siteUrl}/pt${r.path}`,
          },
        },
      })
    }
  }
  return entries
}
