import { useLanguage } from "@/contexts/language-context";
import { content } from "@/lib/content";

export default function RightsReserved() {
	const { language } = useLanguage();
	const C = content[language];

    return (
	  
		<div className="text-black mx-auto text-center border-t-2 py-3 max-w-[1800px]">
			<p className="!text-xs !text-center !text-black">&copy; {new Date().getFullYear()} {C.rightsReserved.allRights} <a href="https://reddunesolutions.pt/" className="underline hover:text-red-600">RedDune Solutions</a></p>
		</div>
    );
}
