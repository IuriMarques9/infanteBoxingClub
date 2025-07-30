import RightsReserved from "@/components/rootlayout/footers/RightsReserved";

export const metadata = {
    title: "Email enviado",
};

export default function Email() {
    return (
    <body class="bg-[#CCA158] text-gray-900 min-w-[250px] py-20">
        <main class="w-3/4 bg-white mx-auto rounded-lg p-10 flex flex-col gap-8 max-w-[1000px]">
            <h2 class="text-[#F47D1B] font-bold">Email enviado com sucesso!</h2>

            <p class="!text-gray-900">Obrigado por entrar em contacto. Recebemos a sua mensagem e valorizamos o seu interesse. A nossa equipa irá analisar a sua solicitação e responder-lhe-á o mais brevemente possível.</p>
            <p class="!text-gray-900">Para voltar para o site clique <a href="index.html" class="underline hover:text-[#F47D1B] hover:underline">aqui</a>.</p>
        </main>

        <RightsReserved/>
    </body>
)
}