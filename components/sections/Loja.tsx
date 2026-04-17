'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ShoppingBag } from "lucide-react";

export default function Merch() {
  const { language } = useLanguage();
  const C = content[language];
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await (supabase
          .from('store_products')
          .select('*')
          .order('created_at', { ascending: false }) as any);
        
        if (data) setProdutos(data);
      } catch (e) {
        console.error("Erro a carregar produtos", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section id="merch" className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider text-foreground">
            {C.merch.title}
          </h2>
          <div className="section-divider mt-4"></div>
          <p className="mt-6 text-xl text-muted-foreground">{C.merch.subtitle}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : produtos.length === 0 ? (
          <div className="mt-14 text-center py-20 bg-card/20 rounded-2xl border border-dashed border-white/10">
            <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 italic">Brevemente disponível. Fica atento!</p>
          </div>
        ) : (
          <Carousel 
            className="mt-14 w-full mx-auto"
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
              })
            ]}
          >
            <CarouselContent>
              {produtos.map(produto => (
                <CarouselItem key={produto.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="card-gold-accent bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 text-start h-full hover:border-[#E8B55B]/40 transition-all duration-300 group shadow-2xl">
                    <div className="overflow-hidden relative aspect-square m-4 rounded-xl">
                      {produto.imageUrl ? (
                        <Image
                          src={produto.imageUrl}
                          alt={produto.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white/5 uppercase font-headline">No Image</div>
                      )}
                      {!produto.in_stock && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] z-20 flex items-center justify-center">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff4444] border-2 border-[#ff4444]/30 px-4 py-2 bg-[#ff4444]/10 rounded-full rotate-12">
                             Esgotado
                          </span>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pt-2 px-6">
                      <div className="space-y-1">
                        <CardTitle className="font-headline text-2xl uppercase tracking-wider text-foreground group-hover:text-[#E8B55B] transition-colors">
                          {produto.name}
                        </CardTitle>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.1em] font-medium">
                          {produto.description || 'Infante Boxing Club'}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-2">
                      <p className="text-2xl font-black text-[#E8B55B]">{produto.price}€</p>
                    </CardContent>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
}
