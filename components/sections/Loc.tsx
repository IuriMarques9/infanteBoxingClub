

export default function Loc() {

    return (
        <section id="Localizacao" className="w-full bg-secondary flex flex-col gap-3 items-start h-fit ">
            <div className="container mx-auto p-4">
                <iframe className="h-fit min-h-50 w-full" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d445.44792594381016!2d-7.846343649702527!3d37.033724619936166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0554cbeb38c453%3A0x9f8833f7716e6678!2sR.%20Dez%20Junho%204%2C%208700-247%20Olh%C3%A3o!5e0!3m2!1spt-PT!2spt!4v1761267069754!5m2!1spt-PT!2spt" width="600" height="450" style={{border:0}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>                    
                <h6 className="text-muted-foreground text-sm">Rua Dâmaso da Encarnação Nº4, 8700-247 Olhão</h6>
            </div>
        </section>
    );
}