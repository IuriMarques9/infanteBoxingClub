import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function MobileHero() {
	const hardScroll = () => {
        const html = document.documentElement;
        // Desativa smooth
        html.style.scrollBehavior = 'auto';
        // Vai para a seção "Contacto"
        document.getElementById('Contacto')?.scrollIntoView({ behavior: 'auto' });
        // Restaura smooth após a rolagem
        setTimeout(() => {
            html.style.scrollBehavior = '';
        }, 0)}

    return (
		<>

			{/*Hero Desktop*/}
                <div className="hidden md:flex w-full items-center justify-between pb-25 relative">
                    <div className="absolute top-0 w-full h-full opacity-20 z-0"> {/*Background video*/}
                        <video autoPlay muted loop playsInline src="/videoHero.webm" className="w-full h-full object-fill"></video>
                    </div>
                    

                    <div className="bg-black p-5 w-70 h-80 lg:w-140 lg:h-130 z-1" style={{clipPath: 'polygon(0 0, 100% 0, 0 100%)'}}>
                        <Image src="/infanteLogo.png" width={200} height={200} className="w-3/5" alt="Logo" priority/>
                    </div>
                    
                    <div className="flex flex-col gap-10 w-full z-1">
                        <h1 className="text-[#CCA158] self-start">Luta pelo teu bem-estar</h1>
            
                        <div className="flex flex-col w-full justify-start gap-1">
                            <p>Já não chega de desculpas e sedentarismo?</p>
            
                            <h3>Vem treinar connosco!</h3>
                        </div>
                        
                        <Button onClick={hardScroll} className="text-nowrap hover:bg-[#EAEAEA] hover:text-black hover:cursor-pointer bg-black w-2/4 max-w-[700px] text-white py-4 px-8 rounded-sm">Primeira aula grátis</Button>

                    </div>
                </div>

                <Image width={250} height={250} className="max-w-[340px] w-1/5 absolute bottom-5 right-1/16" src="/boneco.png" alt="Boneco" />
        
		</>
    );
}
