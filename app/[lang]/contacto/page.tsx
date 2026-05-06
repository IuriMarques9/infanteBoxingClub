import type { Metadata } from "next";
import ContactoClient from "./ContactoClient";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumb";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://infanteboxingclub.pt";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isPt = lang === 'pt'
  const title = isPt ? "Contacto" : "Contact"
  const description = isPt
    ? "Contacta o Infante Boxing Club. Morada, horário de atendimento, mapa e formulário para marcares a tua primeira aula grátis."
    : "Contact Infante Boxing Club. Address, opening hours, map and form to book your first free class."
  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${lang}/contacto`,
      languages: {
        'pt-PT': `${siteUrl}/pt/contacto`,
        'en-US': `${siteUrl}/en/contacto`,
        'x-default': `${siteUrl}/pt/contacto`,
      },
    },
    openGraph: {
      type: "website",
      url: `${siteUrl}/${lang}/contacto`,
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

export default async function ContactoPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ modalidade?: string; assunto?: string; produto?: string }>;
}) {
  const { lang } = await params
  const resolved = (await searchParams) ?? {};
  const isPt = lang === 'pt'
  const ld = breadcrumbJsonLd(siteUrl, [
    { name: isPt ? 'Início' : 'Home', url: `/${lang}` },
    { name: isPt ? 'Contacto' : 'Contact', url: `/${lang}/contacto` },
  ])
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <ContactoClient
        modalidade={resolved.modalidade}
        assunto={resolved.assunto}
        produto={resolved.produto}
      />
    </>
  );
}
