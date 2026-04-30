import type { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumb";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://infanteboxingclub.pt";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isPt = lang === 'pt'
  const title = isPt ? "Política de Privacidade" : "Privacy Policy"
  const description = isPt
    ? "Política de privacidade do Infante Boxing Club. Saiba como tratamos os seus dados pessoais recolhidos através do formulário de contacto."
    : "Infante Boxing Club privacy policy. Learn how we handle personal data collected via the contact form."
  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${lang}/privacy-policy`,
      languages: {
        'pt-PT': `${siteUrl}/pt/privacy-policy`,
        'en-US': `${siteUrl}/en/privacy-policy`,
        'x-default': `${siteUrl}/pt/privacy-policy`,
      },
    },
    robots: { index: true, follow: false },
    openGraph: {
      type: "article",
      url: `${siteUrl}/${lang}/privacy-policy`,
      title: `${title} | Infante Boxing Club`,
      description,
      locale: isPt ? 'pt_PT' : 'en_US',
    },
  }
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isPt = lang === 'pt'
  const ld = breadcrumbJsonLd(siteUrl, [
    { name: isPt ? 'Início' : 'Home', url: `/${lang}` },
    { name: isPt ? 'Política de Privacidade' : 'Privacy Policy', url: `/${lang}/privacy-policy` },
  ])
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <PrivacyPolicyClient />
    </>
  );
}
