"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/navigation";

export default function MobileHeader() {
	const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

	const toggleSidePanel = () => {setIsSidePanelOpen(!isSidePanelOpen);} // Toggle the side panel visibility

	useEffect(() => {
			if (isSidePanelOpen) {
				// Bloqueia o scroll da página
				document.body.style.overflow = "hidden";
			} else {
				// Restaura o scroll da página
				document.body.style.overflow = "";
			}
	
			// Limpa o efeito ao desmontar o componente (segurança)
			return () => {
				document.body.style.overflow = "";
			};
		}, [isSidePanelOpen]);

    return (
		<>
			{/*Side Panel*/}
			{
				isSidePanelOpen && (
					<div id="SidePanelMobile" className="z-99 fixed top-0 left-0 w-11/12 h-screen backdrop-blur-xs text-[#CCA158]">
						<div className="absolute top-0 left-0 w-full sm:w-2/4 h-screen bg-[#EAEAEA]">
								<div className="m-2">
									<div className="flex items-center justify-between w-full px-2">
										<h4 className="!text-[#CCA158]">Navegação</h4>
										
										<X onClick={toggleSidePanel} className="flex-none hover:cursor-pointer hover:scale-110" width="25" height="25" fill="transparent" stroke="#837d7dff" />							
									</div>
									
									<nav className="flex flex-col gap-5 p-3">
										{navLinks.map((nav) => (
											<Link onClick={toggleSidePanel} key={nav.title} href={nav.href} className="w-fit flex items-center gap-2 hover:scale-105">{nav.icon}{nav.title}</Link>
										))}
									</nav>
								</div>
						</div>
					</div>
				)
			}
					
			<div>
				<Menu onClick={toggleSidePanel} className="hover:scale-110 hover:cursor-pointer" width={30} height={30} stroke="#ffffffff"/>
			</div>
		</>
    );
}
