import type { Metadata, Viewport } from "next";
import { Roboto, Teko } from "next/font/google";
import { Toaster } from "../components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { BUSINESS } from "@/lib/business";

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
  manifest: "/manifest.webmanifest",
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

// SportsActivityLocation + LocalBusiness + SportsClub combinados — Google
// interpreta LocalBusiness para Maps/horários, SportsActivityLocation para
// nicho desporto e SportsClub habilita rich-results de organização desportiva.
// Todos os dados vêm de `lib/business.ts` (single source of truth).
const dayOfWeekFull: Record<string, string> = {
  Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday',
  Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday',
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["SportsActivityLocation", "LocalBusiness", "SportsClub"],
  "@id": `${siteUrl}#organization`,
  name: BUSINESS.name,
  alternateName: BUSINESS.alternateName,
  legalName: BUSINESS.legalName,
  description: BUSINESS.description.pt,
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/infanteLogo.png`,
    width: 669,
    height: 664,
  },
  image: `${siteUrl}/infanteLogo.png`,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  priceRange: BUSINESS.priceRange,
  sport: ["Boxing", "Boxe"],
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.locality,
    postalCode: BUSINESS.address.postalCode,
    addressRegion: BUSINESS.address.region,
    addressCountry: BUSINESS.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: BUSINESS.geo.lat,
    longitude: BUSINESS.geo.lng,
  },
  areaServed: [
    { "@type": "City", name: BUSINESS.address.locality },
    { "@type": "AdministrativeArea", name: "Algarve" },
  ],
  memberOf: {
    "@type": "SportsOrganization",
    name: BUSINESS.parent.name,
    url: BUSINESS.parent.url,
  },
  sameAs: [BUSINESS.social.facebook, BUSINESS.social.instagram],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: BUSINESS.hours.days.map(d => dayOfWeekFull[d]),
      opens: BUSINESS.hours.open,
      closes: BUSINESS.hours.close,
    },
  ],
  foundingDate: BUSINESS.founded,
  // Catálogo de turmas — alimenta rich result "Services" no Google.
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Aulas de Boxe",
    itemListElement: BUSINESS.services.map(s => ({
      "@type": "Service",
      name: s.name,
      provider: { "@id": `${siteUrl}#organization` },
      areaServed: { "@type": "City", name: BUSINESS.address.locality },
      serviceType: "Aulas de boxe",
      audience: 'audienceType' in s
        ? { "@type": "PeopleAudience", audienceType: s.audienceType }
        : {
            "@type": "PeopleAudience",
            ...(s.minAge ? { suggestedMinAge: s.minAge } : {}),
            ...('maxAge' in s && s.maxAge ? { suggestedMaxAge: s.maxAge } : {}),
          },
    })),
  },
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
        text: `${BUSINESS.address.full} (Algarve, Portugal).`,
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
        {/* preconnect/dns-prefetch para domínios externos críticos —
            poupa o handshake TLS quando o browser começar a pedir
            imagens optimizadas / signed URLs */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
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
