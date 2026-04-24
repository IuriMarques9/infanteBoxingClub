'use client';
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "../../lib/placeholder-images";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";

const partnerImages = PlaceHolderImages.filter((img) => img.id.startsWith('partner-'));

export default function Partnerships() {
  const { language } = useLanguage();
  const C = content[language];
  const P = C.partnerships;

  return (
    <section id="partners" className="relative overflow-hidden py-10 md:py-14 bg-card">
      <div className="text-center mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/80">{P.eyebrow}</p>
      </div>

      <div
        className="relative max-w-7xl mx-auto select-none overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
        }}
      >
        <div className="marquee-track flex w-max items-center gap-20">
          {[...partnerImages, ...partnerImages, ...partnerImages, ...partnerImages].map((image, index) => (
            <div
              key={index}
              className="relative flex shrink-0 items-center justify-center w-[160px] h-[60px]"
            >
              <Link
                className="partner-logo block w-full h-full"
                href={image.link || '/'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  height={200}
                  width={200}
                  className="w-full h-full object-contain"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
