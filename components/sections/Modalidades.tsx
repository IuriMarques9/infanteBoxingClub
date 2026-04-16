import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { createClient } from "@/lib/supabase/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BoxingStyles() {
  const { language } = useLanguage();
  const C = content[language];
  const [modalidades, setModalidades] = useState<any[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchModalidades = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('modalidades').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setModalidades(data);
      }
    };
    fetchModalidades();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".mod-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [modalidades]);

  // Fallback para conteúdo estático caso a BD esteja vazia
  const displayItems = modalidades.length > 0 ? modalidades : C.boxingStyles.styles.map((style, i) => ({
    title: style.title,
    description: style.description,
    imageurl: "/placeholder-boxing.jpg" // Usa um placeholder estático caso não haja da BD
  }));

  return (
    <section id="boxing-styles" ref={sectionRef} className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full z-0 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-4">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider text-primary">
            {C.boxingStyles.title}
          </h2>
          <div className="section-divider mt-4"></div>
          <p className="mt-6 text-lg text-muted-foreground">
            {C.boxingStyles.subtitle}
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayItems.map((item, index) => (
            <div key={index} className="mod-card card-gold-accent group bg-card/60 backdrop-blur-md rounded-xl overflow-hidden border border-zinc-800 hover:border-primary/50 hover:shadow-[0_0_30px_hsl(41_55%_57%/0.15)] transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <div className="overflow-hidden relative h-64">
                {/* Imagem Padrão ou vinda do DB */}
                <div className="absolute inset-0 bg-zinc-800" />
                {item.imageurl && (
                  <Image 
                    src={item.imageurl !== "/placeholder-boxing.jpg" ? item.imageurl : "/infanteLogo.png"} 
                    alt={item.title} 
                    fill
                    className={`object-cover transition-transform duration-700 group-hover:scale-110 ${item.imageurl === "/placeholder-boxing.jpg" ? "opacity-30 object-contain p-8" : ""}`} 
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
              </div>
              <CardHeader className="relative z-10 -mt-6">
                <CardTitle className="font-headline text-2xl uppercase tracking-wider text-primary drop-shadow-md">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                {item.horario_text && (
                  <div className="mt-4 inline-block bg-primary/10 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-primary/20">
                    {item.horario_text}
                  </div>
                )}
              </CardContent>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
