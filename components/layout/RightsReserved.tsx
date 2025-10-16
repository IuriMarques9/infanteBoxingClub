import Image from "next/image";

export default function RightsReserved() {
    return (
		<div className="text-black mx-auto text-center border-t-2 py-3 max-w-[1800px] mx-auto">
			<p className="!text-xs !text-center !text-black">&copy; {new Date().getFullYear()} Todos os direitos reservados a Infante Boxing Club - Fornecido por <a href="https://reddunesolutions.pt/" className="underline hover:text-red-600">RedDune Solutions</a></p>
		</div>
    );
}
