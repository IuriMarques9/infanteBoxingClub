import { useLanguage } from "@/contexts/language-context";
import { content } from "@/lib/content";

export default function RightsReserved() {
	const { language } = useLanguage();
	const C = content[language];

    return (
	  
		<div className="mx-auto text-center py-3 max-w-[1800px]">
			<p className="text-xs text-white/50">&copy; {new Date().getFullYear()} {C.rightsReserved.allRights} <a href="https://reddunesolutions.pt/" className="underline hover:text-[#841515] transition-colors">RedDune Solutions</a></p>
		</div>
    );
}
