import type { Metadata, Viewport } from "next";
import { Roboto, Teko } from "next/font/google";
import { Toaster } from "../components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

// Fontes auto-hospedadas pelo Next.js — eliminam render-blocking dos
// pedidos a fonts.googleapis.com e o FOIT do display=swap externo.
// Variáveis CSS expostas como --font-roboto e --font-teko (já usadas
// em tailwind.config.ts via fontFamily.body / .headline).
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});
const teko = Teko({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-teko",
  display: "swap",
});

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
      { url: "/infanteLogo.png", type: "image/png" },
    ],
    apple: "/infanteLogo.png",
    shortcut: "/infanteLogo.png",
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
    // images é auto-injectada pelo `app/opengraph-image.tsx`
    // (1200×630 gerada dinamicamente).
  },
  twitter: {
    card: "summary_large_image",
    title: "Infante Boxing Club | Ginásio de Boxe em Olhão",
    description:
      "Boxe de competição, manutenção e educativo em Olhão. Começa com a 1ª aula grátis.",
    // images via `app/twitter-image.tsx` (reusa o opengraph)
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
    // Para verificar o site no Google Search Console:
    // 1) Abre https://search.google.com/search-console
    // 2) Adiciona a propriedade `infanteboxingclub.pt`
    // 3) Escolhe "HTML tag" e copia só o conteúdo do `content="..."`
    // 4) Coloca o token na variável de ambiente
    //    GOOGLE_SITE_VERIFICATION no `.env.local` (server-only,
    //    sem prefixo NEXT_PUBLIC_ — não fica exposto ao cliente).
    google: process.env.GOOGLE_SITE_VERIFICATION,
    // Se também quiseres Bing Webmaster Tools:
    // other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION },
  },
};

// SportsActivityLocation + LocalBusiness combinados — Google interpreta
// LocalBusiness para Maps/horários e SportsActivityLocation para nicho desporto.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["SportsActivityLocation", "LocalBusiness"],
  "@id": `${siteUrl}#organization`,
  name: "Infante Boxing Club",
  alternateName: "Infante Boxing",
  description:
    "Ginásio de boxe em Olhão filiado na Federação Portuguesa de Boxe. Aulas de boxe de competição, manutenção e educativo.",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/infanteLogo.png`,
    width: 669,
    height: 664,
  },
  image: `${siteUrl}/infanteLogo.png`,
  telephone: "+351 910 389 071",
  email: "infanteboxingclub@gmail.com",
  priceRange: "€€",
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
  // Horário de funcionamento — segundas a sextas, treinos do final do dia.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "17:00",
      closes: "22:00",
    },
  ],
  foundingDate: "2020",
};

// Schema do WebSite — habilita sitelinks searchbox no Google.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}#website`,
  url: siteUrl,
  name: "Infante Boxing Club",
  inLanguage: ["pt-PT", "en-US"],
  publisher: { "@id": `${siteUrl}#organization` },
  // Caixa de pesquisa direta nos resultados Google (se site tiver search)
  // potentialAction: {
  //   "@type": "SearchAction",
  //   target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/search?q={query}` },
  //   "query-input": "required name=query",
  // },
}

// Schema de FAQ — aumenta probabilidade de rich snippets na pesquisa.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "A primeira aula é mesmo grátis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Quem nunca treinou connosco pode experimentar uma aula gratuitamente. Basta apareceres no ginásio com roupa confortável.",
      },
    },
    {
      "@type": "Question",
      name: "Em que turmas posso treinar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Temos turmas para Gatinhos (5-8 anos), Suricatas (9-11), Leões (12-15), Adultos e turma só de Mulheres. Cada turma tem horário próprio.",
      },
    },
    {
      "@type": "Question",
      name: "Onde fica o ginásio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rua Dâmaso da Encarnação Nº4, 8700-247 Olhão (Algarve, Portugal).",
      },
    },
    {
      "@type": "Question",
      name: "São filiados na Federação Portuguesa de Boxe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim, somos um clube oficial filiado na Federação Portuguesa de Boxe (FPB).",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html translate="no" lang="pt-PT" className={`!scroll-smooth dark ${roboto.variable} ${teko.variable}`}>
      <head>
        <meta name="google" content="notranslate" />
        {/* Supabase Storage para signed URLs de avatares e documentos */}
        <link rel="dns-prefetch" href="https://sbpmmkooygjqmxxasknq.supabase.co" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        {/* O LanguageProvider passou para `app/[lang]/layout.tsx` —
            só envolve as rotas públicas multilingues. Dashboard e
            login não precisam dele. */}
        <div className="relative flex min-h-dvh flex-col bg-background">
          {children}
        </div>
        <Toaster />
        <SonnerToaster
          theme="dark"
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: '#1A1A1A',
              border: '1px solid rgba(232, 181, 91, 0.2)',
              color: '#fff',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
