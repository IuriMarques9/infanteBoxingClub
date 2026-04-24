'use client';
import { MapPin } from "lucide-react";
import { useLanguage } from "../../contexts/language-context";
import SectionShell from "../shared/SectionShell";
import SectionHeading from "../shared/SectionHeading";

export default function Loc() {
    const { language } = useLanguage();
    const eyebrow = language === 'pt' ? 'LOCALIZAÇÃO' : 'LOCATION';
    const title = language === 'pt' ? 'Onde Nos Encontrar' : 'Find Us';
    const address = "Rua Dâmaso da Encarnação Nº4, 8700-247 Olhão";
    const mapQuery = encodeURIComponent(address);
    const mapsLink = `https://maps.google.com/?q=${mapQuery}`;

    return (
        <SectionShell id="Localizacao" surface="default">
            <SectionHeading eyebrow={eyebrow} title={title} />

            <iframe
                className="aspect-video w-full rounded-lg border border-zinc-800"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d445.44792594381016!2d-7.846343649702527!3d37.033724619936166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0554cbeb38c453%3A0x9f8833f7716e6678!2sR.%20Dez%20Junho%204%2C%208700-247%20Olh%C3%A3o!5e0!3m2!1spt-PT!2spt!4v1761267069754!5m2!1spt-PT!2spt"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                >
                    {address}
                </a>
            </div>
        </SectionShell>
    );
}
