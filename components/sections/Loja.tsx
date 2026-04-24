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
import { ShoppingBag } from "lucide-react";
import SectionShell from "../shared/SectionShell";
import SectionHeading from "../shared/SectionHeading";
import EmptyState from "../shared/EmptyState";
import Skeleton from "../shared/Skeleton";

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
    <SectionShell id="merch" surface="alt">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none -translate-y-1/2" />

      <div className="relative z-10">
        <SectionHeading
          title={C.merch.title}
          subtitle={C.merch.subtitle}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <Skeleton variant="card" count={4} />
          </div>
        ) : produtos.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={C.merchExtra.empty.title}
            description={C.merchExtra.empty.description}
          />
        ) : (
          <Carousel
            className="w-full mx-auto"
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
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white/20 uppercase text-xs tracking-widest font-headline">
                          {C.merchExtra.noImage}
                        </div>
                      )}
                      {!produto.in_stock && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] z-20 flex items-center justify-center">
                          <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm ring-1 ring-white/20">
                            {C.merchExtra.soldOut}
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
    </SectionShell>
  );
}
