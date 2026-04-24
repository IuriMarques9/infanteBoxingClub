import type { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://infanteboxingclub.pt";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de privacidade do Infante Boxing Club. Saiba como tratamos os seus dados pessoais recolhidos através do formulário de contacto.",
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  robots: {
    index: true,
    follow: false,
  },
  openGraph: {
    type: "article",
    url: `${siteUrl}/privacy-policy`,
    title: "Política de Privacidade | Infante Boxing Club",
    description: "Política de privacidade do Infante Boxing Club.",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
