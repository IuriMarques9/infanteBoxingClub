import { ReactNode } from "react";
import type { Metadata } from "next";
import DashboardSidebar from "./DashboardSidebar";
import CommandPaletteServer from "./CommandPaletteServer";

// Toda a área administrativa fora dos motores de busca.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-white/90 selection:bg-[#E8B55B]/30 font-sans">
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
         {/* Background ambient light */}
         <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#E8B55B]/5 to-transparent pointer-events-none" />

        <div className="p-4 pt-20 sm:p-6 sm:pt-20 md:p-8 md:pt-8 lg:p-10 max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>

      {/* Command Palette (Ctrl/⌘+K) — global em toda a dashboard */}
      <CommandPaletteServer />
    </div>
  );
}
