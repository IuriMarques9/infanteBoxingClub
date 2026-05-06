'use client';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sobre from "@/components/sections/Sobre";

export default function SobrePageClient() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24 min-h-screen bg-card">
        <Sobre />
      </main>
      <Footer />
    </>
  );
}
