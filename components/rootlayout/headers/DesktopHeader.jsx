import Link from "next/link";
import { navLinks } from "@/data/navigation";
export default function DesktopHeader() {
	
    return (
    	<nav className="flex gap-6">
			{
				//Pega os links do arquivo navigation.js
				//e renderiza os links com o componente Link
				navLinks.map((nav) => (
					<Link className="font-semibold decoration-2 hover:underline" key={nav.title} href={nav.href}>{nav.title}</Link>
				))
			}
		</nav>
    );
}
