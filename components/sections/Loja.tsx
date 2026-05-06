'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../ui/carousel";
import Link from "next/link";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { createClient } from "@/lib/supabase/client";
import { Mail, ShoppingBag } from "lucide-react";
import SectionShell from "../shared/SectionShell";
import SectionHeading from "../shared/SectionHeading";
import EmptyState from "../shared/EmptyState";
import Skeleton from "../shared/Skeleton";

export default function Merch() {
  const { language } = useLanguage();
  const C = content[language];
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [snapCount, setSnapCount] = useState(0);
  const [selectedSnap, setSelectedSnap] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setSnapCount(api.scrollSnapList().length);
      setSelectedSnap(api.selectedScrollSnap());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await (supabase
          .from('store_products')
          .select('*')
          .eq('published', true)
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

  const categorias = [...new Set(produtos.map((p: any) => p.category).filter(Boolean))] as string[]
  const produtosFiltrados = categoriaAtiva
    ? produtos.filter((p: any) => p.category === categoriaAtiva)
    : produtos
  // Mostra a categoria na língua atual (fallback PT). O filtro continua a usar PT internamente.
  const displayCategoria = (cat: string) => {
    if (language === 'pt') return cat
    const p = produtos.find((p: any) => p.category === cat)
    return p?.category_en || cat
  }
  const todosLabel = language === 'pt' ? 'Todos' : 'All'

  return (
    <SectionShell id="merch" surface="alt">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none -translate-y-1/2" />

      <div className="relative z-10">
        <SectionHeading
          title={C.merch.title}
          subtitle={C.merch.subtitle}
        />

        {categorias.length > 0 && (
          <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setCategoriaAtiva(null)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                categoriaAtiva === null
                  ? 'bg-[#E8B55B] text-black border-[#E8B55B]'
                  : 'bg-transparent text-white/50 border-white/10 hover:border-[#E8B55B]/50 hover:text-[#E8B55B]'
              }`}
            >
              {todosLabel}
            </button>
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                  categoriaAtiva === cat
                    ? 'bg-[#E8B55B] text-black border-[#E8B55B]'
                    : 'bg-transparent text-white/50 border-white/10 hover:border-[#E8B55B]/50 hover:text-[#E8B55B]'
                }`}
              >
                {displayCategoria(cat)}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <Skeleton variant="card" count={4} />
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={C.merchExtra.empty.title}
            description={C.merchExtra.empty.description}
          />
        ) : (
          <Carousel
            className="w-full mx-auto"
            setApi={setApi}
            opts={{
              align: "start",
              slidesToScroll: 1,
              breakpoints: {
                '(min-width: 768px)': { slidesToScroll: 2 },
                '(min-width: 1024px)': { slidesToScroll: 3 },
                '(min-width: 1280px)': { slidesToScroll: 4 },
              },
            }}
          >
            <CarouselContent className={produtosFiltrados.length <= 4 ? "justify-center" : undefined}>
              {produtosFiltrados.map(produto => (
                <CarouselItem key={produto.id} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="card-gold-accent bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 text-start h-full flex flex-col hover:border-[#E8B55B]/40 transition-all duration-300 group shadow-2xl">
                    <div className="overflow-hidden relative aspect-square m-2 md:m-4 rounded-xl">
                      {produto.imageurl ? (
                        <Image
                          src={produto.imageurl}
                          alt={produto.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white/20 uppercase text-xs tracking-widest font-headline">
                          {C.merchExtra.noImage}
                        </div>
                      )}
                    </div>
                    <CardHeader className="pt-2 px-3 md:px-6">
                      <div className="space-y-1">
                        <CardTitle className="font-headline text-base md:text-2xl uppercase tracking-wider text-foreground group-hover:text-[#E8B55B] transition-colors">
                          {(language === 'en' && produto.name_en) || produto.name}
                        </CardTitle>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.1em] font-medium">
                          {(language === 'en' && produto.description_en) || produto.description || 'Infante Boxing Club'}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="px-3 md:px-6 pb-4 md:pb-6 pt-2 space-y-3 mt-auto">
                      <p className="text-lg md:text-2xl font-black text-[#E8B55B]">{produto.price}€</p>
                      <Link
                        href={`/${language}/contacto?assunto=produto&produto=${encodeURIComponent((language === 'en' && produto.name_en) || produto.name)}`}
                        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-[#E8B55B]/30 text-[#E8B55B] text-[10px] md:text-xs font-bold uppercase tracking-wider hover:bg-[#E8B55B]/10 transition-colors"
                      >
                        <Mail className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {C.merchExtra.askButton}
                      </Link>
                    </CardContent>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex md:-left-10 bg-[#E8B55B] text-black border-none hover:bg-[#E8B55B]/90 [&>svg]:text-black" />
            <CarouselNext className="hidden md:flex md:-right-10 bg-[#E8B55B] text-black border-none hover:bg-[#E8B55B]/90 [&>svg]:text-black" />
          </Carousel>
        )}

        {!loading && snapCount > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: snapCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                aria-label={`Ir para página ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === selectedSnap ? 'bg-[#E8B55B] w-6' : 'bg-white/20 hover:bg-white/40 w-2'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </SectionShell>
  );
}
