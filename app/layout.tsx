import type { Metadata } from "next";
import { Toaster } from "../components/ui/toaster";
import "../app/globals.css";
import { LanguageProvider } from "../contexts/language-context";

export const metadata: Metadata = {
  title: "Infante Boxing Club",
  description: "Train with champions at Infante Boxing Club.",
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
      <body className="font-body antialiased">
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
