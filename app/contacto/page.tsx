import type { Metadata } from "next";
import ContactoClient from "./ContactoClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://infanteboxingclub.pt";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta o Infante Boxing Club. Morada, horário de atendimento, mapa e formulário para marcares a tua primeira aula grátis.",
  alternates: {
    canonical: `${siteUrl}/contacto`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/contacto`,
    title: "Contacto | Infante Boxing Club",
    description:
      "Morada, horário, mapa e formulário de contacto do Infante Boxing Club em Olhão.",
    images: [
      {
        url: "/infanteLogo.png",
        width: 1200,
        height: 630,
        alt: "Infante Boxing Club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto | Infante Boxing Club",
    description: "Contacta o Infante Boxing Club em Olhão.",
    images: ["/infanteLogo.png"],
  },
};

export default async function ContactoPage({
  searchParams,
}: {
  searchParams?: Promise<{ modalidade?: string }>;
}) {
  const resolved = (await searchParams) ?? {};
  return <ContactoClient modalidade={resolved.modalidade} />;
}
