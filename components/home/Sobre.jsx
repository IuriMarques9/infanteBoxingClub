import Image from "next/image";
export default function Sobre() {

    return (
        <section id="Sobre" className="max-w-[1800px] mx-auto flex flex-col gap-10 h-fit p-5 md:px-10 mx-auto w-full bg-white">
            <div className="border-b-4 border-[#CCA158]">
                <h2>Sobre o Clube</h2>
            </div>
    
            <p className="text-justify !text-xl">
                A nossa associação nasceu da paixão de Ricardo Infante pelo boxe e pelo impacto positivo que este pode ter na vida das pessoas. Com o apoio incondicional da sua mulher, da família e de amigos próximos, o projeto ganhou forma, cresceu com propósito e tornou-se numa referência local e nacional.
                <br /><br />Mais do que um clube de boxe, somos uma comunidade que acredita na força da entreajuda, no respeito mútuo e no desenvolvimento pessoal através do desporto. Aqui acolhemos pessoas de todas as idades — desde crianças a seniores — oferecendo uma abordagem segura, técnica e adaptada a cada fase da vida criando assim um espaço onde o boxe seja acessível, respeitado e valorizado como ferramenta de crescimento humano.
                <br /><br />A nossa ligação com a Federação Portuguesa de Boxe reforça o nosso compromisso com a qualidade, rigor e profissionalismo. Mas é a relação próxima com a comunidade que nos distingue: juntos, construímos um espaço onde o boxe é mais do que uma modalidade — é um instrumento de transformação, inclusão e união.
                <br /><br />Cada treino é uma oportunidade. Cada pessoa é valorizada. E cada conquista, por mais pequena que pareça, é celebrada em conjunto. Aqui não formamos apenas atletas. Formamos pessoas.
            </p>
                
                
            <div id="SliderPictures" className="relative w-full flex justify-center overflow-hidden h-[400px]">
                <Image width={150} height={150} className="!opacity-100" src="/ricardo.png" alt="" />
                <Image width={150} height={150} src="/luana.png" alt="" />
                <Image width={150} height={150} src="/rafa.png" alt="" />
            </div>
        </section>
    );
}