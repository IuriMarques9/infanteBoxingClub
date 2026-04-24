import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-white/90 selection:bg-[#E8B55B]/30 font-sans">
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
         {/* Background ambient light */}
         <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#E8B55B]/5 to-transparent pointer-events-none" />

        <div className="p-10 max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
