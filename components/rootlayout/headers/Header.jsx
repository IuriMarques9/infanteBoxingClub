"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Facebook, Instagram, Youtube, X} from "lucide-react";
import IsMobile from "@/hooks/isMobile";
import MobileHeader from "@/components/rootlayout/headers/MobileHeader";
import DesktopHeader from "@/components/rootlayout/headers/DesktopHeader";

export default function Header() {
	const isMobile = IsMobile();
	
    return (
    	<header className="min-w-[300px] flex py-8 px-5 items-center justify-between bg-[#CCA158] shadow w-full">
			<div className="w-full flex justify-between items-center mx-auto"> {/*Conteiner*/}
				{
					isMobile ? <MobileHeader /> : <DesktopHeader />
				}

				<div className=" md:inline-block h-0.5 w-full bg-white mx-6"></div> {/*Linha branca do Header*/}

				{/*Social*/}
				<div className="flex gap-2 items-center">
					<a href="https://www.facebook.com/profile.php?id=100088583096544" target="_blank" rel="noopener noreferrer" className="hover:scale-110">
						<Facebook width={30} height={30}/>
					</a>
					
					<a href="https://www.instagram.com/infanteboxing_club/" target="_blank" rel="noopener noreferrer" className="hover:scale-110">
						<Instagram width={30} height={30}/>
					</a>
				</div>
			</div>
    	</header>
    );
}
