import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { LanguageProvider } from "../../contexts/language-context";

const SUPPORTED_LOCALES = ['pt', 'en'] as const
type Locale = typeof SUPPORTED_LOCALES[number]

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://infanteboxingclub.pt";

// Gera as variantes estáticas /pt e /en — Next pré-renderiza ambas.
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map(lang => ({ lang }))
}

// Metadata no nível de [lang] estabelece OG locale + alternates hreflang.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }, _parent: ResolvingMetadata): Promise<Metadata> {
  const { lang } = await params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) return {}
  return {
    openGraph: {
      locale: lang === 'pt' ? 'pt_PT' : 'en_US',
      alternateLocale: lang === 'pt' ? ['en_US'] : ['pt_PT'],
    },
    alternates: {
      languages: {
        'pt-PT': `${siteUrl}/pt`,
        'en-US': `${siteUrl}/en`,
        'x-default': `${siteUrl}/pt`,
      },
    },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound()

  return (
    <LanguageProvider initialLanguage={lang as Locale}>
      {children}
    </LanguageProvider>
  )
}
