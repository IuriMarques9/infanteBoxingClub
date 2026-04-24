import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://infanteboxingclub.pt";

export const metadata: Metadata = {
  title: "Infante Boxing Club | Ginásio de Boxe em Olhão",
  description:
    "Ginásio de boxe em Olhão filiado na Federação Portuguesa de Boxe. Boxe de competição, manutenção e educativo. Começa com a 1ª aula grátis.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    url: siteUrl,
    title: "Infante Boxing Club | Ginásio de Boxe em Olhão",
    description:
      "Boxe de competição, manutenção e educativo em Olhão. 1ª aula grátis.",
  },
};

export default function Home() {
  return <HomeClient />;
}
