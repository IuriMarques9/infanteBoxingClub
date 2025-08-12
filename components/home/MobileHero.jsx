

export default function MobileHero() {
	
    return (
		<>
                <div className="md:hidden w-full px-5 pt-15 pb-30 flex flex-col gap-6 items-center ">
                    <div className="bg-[url(/infanteLogo.png)] bg-contain h-50 w-50 mx-auto rounded-full"></div>
        
                    <h1 className="text-[#CCA158] self-start">Luta pelo teu bem-estar</h1>
        
                    <div className="flex flex-col w-full justify-start gap-1">
                        <p>Já não chega de desculpas e sedentarismo?</p>
        
                        <h3>Vem treinar connosco!</h3>
                    </div>
                    
                    <a href="#Contacto" className="w-full ">
                        <button className="hover:bg-[#EAEAEA] hover:text-black hover:cursor-pointer bg-black w-full text-white py-4 px-12 rounded-sm">Primeira aula grátis</button>
                    </a>
                </div>
		</>
    );
}
