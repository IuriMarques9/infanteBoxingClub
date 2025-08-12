"use client";
import IsMobile from "@/hooks/isMobile";
import MobileHero from "@/components/home/MobileHero";
import DesktopHero from "@/components/home/DesktopHero";

export default function Hero() {
	const isMobile = IsMobile();

    return (
		<section id="Hero" className="relative">
			{
        		isMobile ? <MobileHero /> : <DesktopHero />
      		}
		</section>
    );
}
