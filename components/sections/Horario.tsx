'use client';
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { TURMA_LABELS, type Turma } from "@/app/dashboard/membros/constants";
import { Clock, Loader2, Calendar } from "lucide-react";

export default function Schedule() {
  const { language } = useLanguage();
  const C = content[language];
  const [horarios, setHorarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHorarios() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await (supabase
          .from('horarios')
          .select('*')
          .order('turma', { ascending: true }) as any);
        
        if (data) setHorarios(data);
      } catch (e) {
        console.error("Erro a carregar horários", e);
      } finally {
        setLoading(false);
      }
    }
    fetchHorarios();
  }, []);

  // Agrupar horários por turma
  const turmasList: Turma[] = ['gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres'];
  const horariosAgrupados = turmasList.map(turma => ({
    key: turma,
    label: TURMA_LABELS[turma],
    items: horarios.filter(h => h.turma === turma)
  })).filter(group => group.items.length > 0);

  return (
    <section id="schedule" className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider text-foreground">
            {C.schedule.title}
          </h2>
          <div className="section-divider mt-4"></div>
          <p className="mt-6 text-xl text-muted-foreground">
            {language === 'pt' 
              ? 'Consulta os horários das nossas turmas e escolhe o melhor momento para o teu treino.' 
              : 'Check our class schedules and choose the best time for your training.'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : horariosAgrupados.length === 0 ? (
          <div className="text-center py-20 text-white/30 border border-dashed border-white/10 rounded-2xl">
            {language === 'pt' 
              ? 'Horários em atualização. Contacta-nos para mais informações.' 
              : 'Schedules being updated. Contact us for more information.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {horariosAgrupados.map((group) => (
              <div 
                key={group.key} 
                className="card-gold-accent bg-card/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(232,181,91,0.1)] group"
              >
                <div className="px-8 py-6 border-b border-white/5 bg-primary/5">
                   <h3 className="font-headline text-2xl font-bold text-[#E8B55B] tracking-wider uppercase group-hover:text-primary transition-colors">
                     {group.label}
                   </h3>
                </div>
                
                <div className="p-8 space-y-6">
                  {group.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#E8B55B]/10 group-hover:border-[#E8B55B]/30 transition-all">
                        <Clock className="w-5 h-5 text-[#E8B55B]" />
                      </div>
                      <div>
                        <p className="text-white/80 font-bold text-sm uppercase tracking-wide">{item.descricao}</p>
                        <p className="text-xl font-bold text-white mt-1">{item.hora}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-8 py-4 bg-black/20 text-center">
                   <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                     Infante Boxing Club · Premium Training
                   </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-16 bg-card/30 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
           <div className="w-12 h-12 rounded-full bg-[#E8B55B]/20 flex items-center justify-center shrink-0">
             <Calendar className="w-6 h-6 text-[#E8B55B]" />
           </div>
           <div>
             <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
               {C.schedule.observations}
             </p>
           </div>
        </div>
      </div>
    </section>
  );
}
