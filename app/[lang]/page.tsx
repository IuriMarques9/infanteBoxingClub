import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://infanteboxingclub.pt";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isPt = lang === 'pt'
  const title = isPt
    ? "Infante Boxing Club | Ginásio de Boxe em Olhão"
    : "Infante Boxing Club | Boxing Gym in Olhão"
  const description = isPt
    ? "Ginásio de boxe em Olhão filiado na Federação Portuguesa de Boxe. Boxe de competição, manutenção e educativo. Começa com a 1ª aula grátis."
    : "Boxing gym in Olhão, official member of the Portuguese Boxing Federation. Competition, fitness and educational boxing. Start with your first free class."

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        'pt-PT': `${siteUrl}/pt`,
        'en-US': `${siteUrl}/en`,
        'x-default': `${siteUrl}/pt`,
      },
    },
    openGraph: {
      url: `${siteUrl}/${lang}`,
      title,
      description,
      locale: isPt ? 'pt_PT' : 'en_US',
    },
  }
}

export default function Home() {
  return <HomeClient />
}
