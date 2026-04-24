import type { Metadata } from "next";
import SobrePageClient from "./SobrePageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://infanteboxingclub.pt";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description:
    "Conhece a história, missão e equipa do Infante Boxing Club. Em Olhão desde 2020, afiliados à Federação Portuguesa de Boxe.",
  alternates: {
    canonical: `${siteUrl}/sobre`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/sobre`,
    title: "Sobre Nós | Infante Boxing Club",
    description:
      "A história, missão e equipa do Infante Boxing Club — ginásio de boxe em Olhão.",
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
    title: "Sobre Nós | Infante Boxing Club",
    description: "A história, missão e equipa do Infante Boxing Club em Olhão.",
    images: ["/infanteLogo.png"],
  },
};

export default function SobrePage() {
  return <SobrePageClient />;
}
