import type { Metadata, Viewport } from "next";
import { Toaster } from "../components/ui/toaster";
import "./globals.css";
import { LanguageProvider } from "../contexts/language-context";
import { Analytics } from "@vercel/analytics/react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://infanteboxingclub.pt";

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Infante Boxing Club | Ginásio de Boxe em Olhão",
    template: "%s | Infante Boxing Club",
  },
  description:
    "Ginásio de boxe em Olhão filiado na Federação Portuguesa de Boxe. Boxe de competição, manutenção e educativo para todos os níveis. Começa com a 1ª aula grátis.",
  applicationName: "Infante Boxing Club",
  generator: "Next.js",
  authors: [{ name: "Infante Boxing Club" }],
  creator: "Infante Boxing Club",
  publisher: "Infante Boxing Club",
  category: "sports",
  keywords: [
    "boxe",
    "boxing",
    "ginásio de boxe",
    "boxe Olhão",
    "boxe Algarve",
    "Infante Boxing Club",
    "treino boxe",
    "boxe competição",
    "boxe manutenção",
    "boxe educativo",
    "aulas de boxe",
    "Federação Portuguesa de Boxe",
  ],
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/infanteLogoSemFundo.png", type: "image/png" },
    ],
    apple: "/infanteLogoSemFundo.png",
    shortcut: "/favicon.ico",
  },
  manifest: undefined,
  openGraph: {
    type: "website",
    locale: "pt_PT",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "Infante Boxing Club",
    title: "Infante Boxing Club | Ginásio de Boxe em Olhão",
    description:
      "Ginásio de boxe em Olhão filiado na Federação Portuguesa de Boxe. Boxe de competição, manutenção e educativo. 1ª aula grátis.",
    images: [
      {
        url: "/infanteLogo.png",
        width: 1200,
        height: 630,
        alt: "Infante Boxing Club — Ginásio de Boxe em Olhão",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infante Boxing Club | Ginásio de Boxe em Olhão",
    description:
      "Boxe de competição, manutenção e educativo em Olhão. Começa com a 1ª aula grátis.",
    images: ["/infanteLogo.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "pt-PT": siteUrl,
      "en-US": siteUrl,
      "x-default": siteUrl,
    },
  },
  verification: {
    // Preenche quando obtiveres o token do Google Search Console:
    // google: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "Infante Boxing Club",
  alternateName: "Infante Boxing",
  description:
    "Ginásio de boxe em Olhão filiado na Federação Portuguesa de Boxe. Aulas de boxe de competição, manutenção e educativo.",
  url: siteUrl,
  logo: `${siteUrl}/infanteLogo.png`,
  image: `${siteUrl}/infanteLogo.png`,
  sport: ["Boxing", "Boxe"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Dâmaso da Encarnação Nº4",
    addressLocality: "Olhão",
    postalCode: "8700-247",
    addressRegion: "Faro",
    addressCountry: "PT",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 37.029,
    longitude: -7.841,
  },
  areaServed: [
    { "@type": "City", name: "Olhão" },
    { "@type": "AdministrativeArea", name: "Algarve" },
  ],
  memberOf: {
    "@type": "Organization",
    name: "Federação Portuguesa de Boxe",
    url: "https://www.fpboxe.pt",
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=100088583096544",
    "https://www.instagram.com/infanteboxing_club/",
  ],
  foundingDate: "2020",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html translate="no" lang="pt-PT" className="!scroll-smooth dark">
      <head>
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&family=Teko:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
          <div className="relative flex min-h-dvh flex-col bg-background">
            {children}
          </div>
          <Toaster />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
