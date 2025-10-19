import type { Metadata } from "next";
import { Toaster } from "../components/ui/toaster";
import "./globals.css";
import { LanguageProvider } from "../contexts/language-context";
import { Roboto, Teko } from "next/font/google";


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-roboto",
});

const teko = Teko({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-teko",
});

export const metadata: Metadata = {
  title: "Infante Boxing Club",
  description: "Train with champions at Infante Boxing Club.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&family=Teko:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${roboto.variable} ${teko.variable} font-body antialiased`}>
        <LanguageProvider>
          <div className="relative flex min-h-dvh flex-col bg-background">
            {children}
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
