import type { Metadata } from "next";
import SobrePageClient from "./SobrePageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://infanteboxingclub.pt";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isPt = lang === 'pt'
  const title = isPt ? "Sobre Nós" : "About Us"
  const description = isPt
    ? "Conhece a história, missão e equipa do Infante Boxing Club. Em Olhão desde 2020, afiliados à Federação Portuguesa de Boxe."
    : "Learn about the history, mission and team of Infante Boxing Club. Based in Olhão since 2020, member of the Portuguese Boxing Federation."
  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${lang}/sobre`,
      languages: {
        'pt-PT': `${siteUrl}/pt/sobre`,
        'en-US': `${siteUrl}/en/sobre`,
        'x-default': `${siteUrl}/pt/sobre`,
      },
    },
    openGraph: {
      type: "website",
      url: `${siteUrl}/${lang}/sobre`,
      title: `${title} | Infante Boxing Club`,
      description,
      locale: isPt ? 'pt_PT' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Infante Boxing Club`,
      description,
    },
  }
}

export default function SobrePage() {
  return <SobrePageClient />;
}
