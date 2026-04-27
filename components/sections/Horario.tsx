'use client';
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { TURMA_LABELS, type Turma } from "@/app/dashboard/membros/constants";
import SectionShell from "../shared/SectionShell";
import SectionHeading from "../shared/SectionHeading";
import Skeleton from "../shared/Skeleton";
import {
  WEEKDAY_LABELS_SHORT,
  WEEKDAY_LABELS_LONG,
  TURMA_AGENDA_TONES,
  collectTimeRanges,
  collectActiveDays,
  findSlots,
  type WeekDay,
} from "@/lib/horarios";
import { cn } from "@/lib/utils";

interface HorarioRow {
  id: string;
  turma: Turma;
  descricao: string;
  hora: string;
  dias_semana?: string[] | null;
  hora_inicio?: string | null;
  hora_fim?: string | null;
}

const DEFAULT_DAYS: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri'];

export default function Schedule() {
  const { language } = useLanguage();
  const C = content[language];
  const [horarios, setHorarios] = useState<HorarioRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHorarios() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await (supabase
          .from('horarios')
          .select('*')
          .order('turma', { ascending: true }) as unknown as Promise<{ data: HorarioRow[] | null }>);
        if (data) setHorarios(data);
      } catch (e) {
        console.error("Erro a carregar horários", e);
      } finally {
        setLoading(false);
      }
    }
    fetchHorarios();
  }, []);

  const activeDays = collectActiveDays(horarios);
  const timeRanges = collectTimeRanges(horarios);
  const extraDays = activeDays.filter(d => !DEFAULT_DAYS.includes(d));
  const columns: WeekDay[] = [...DEFAULT_DAYS, ...extraDays];
  const hasData = timeRanges.length > 0;

  return (
    <SectionShell id="schedule" surface="alt">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="relative z-10">
        <SectionHeading
          title={C.schedule.title}
          subtitle={C.scheduleExtra.subtitleInline}
        />

        {loading ? (
          <Skeleton variant="rect" className="h-80 rounded-2xl" />
        ) : (
          <div className="card-gold-accent bg-card/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-primary/5 border-b border-white/5">
                    <th className="px-4 py-4 text-left font-headline uppercase tracking-[0.25em] text-primary text-xs font-bold w-[140px]">
                      {language === 'pt' ? 'Hora' : 'Time'}
                    </th>
                    {columns.map(day => (
                      <th
                        key={day}
                        className="px-3 py-4 text-center font-headline uppercase tracking-[0.25em] text-primary text-xs font-bold"
                      >
                        <div>{WEEKDAY_LABELS_SHORT[language][day]}</div>
                        <div className="text-[10px] font-normal tracking-wider text-white/40 mt-0.5 normal-case">
                          {WEEKDAY_LABELS_LONG[language][day]}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hasData ? (
                    timeRanges.map((range, idx) => (
                      <tr
                        key={range.key}
                        className={cn(
                          "border-b border-white/5 last:border-0",
                          idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"
                        )}
                      >
                        <td className="px-4 py-3 font-headline text-primary text-sm font-bold tracking-wider whitespace-nowrap">
                          {range.inicio} – {range.fim}
                        </td>
                        {columns.map(day => {
                          const slots = findSlots(horarios, day, range);
                          return (
                            <td key={day} className="px-2 py-2 align-middle">
                              {slots.length > 0 ? (
                                <div className="space-y-1">
                                  {slots.map(slot => (
                                    <div
                                      key={slot.id}
                                      className={cn(
                                        "rounded-lg border p-2 text-center transition-transform hover:scale-[1.03]",
                                        TURMA_AGENDA_TONES[slot.turma]
                                      )}
                                    >
                                      <div className="uppercase tracking-wider text-[10px] font-bold leading-tight">
                                        {TURMA_LABELS[slot.turma]}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center text-white/15 text-sm select-none">—</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-16 text-center text-white/30 text-sm italic">
                        {language === 'pt'
                          ? 'Horários em atualização. Contacta-nos para mais informações.'
                          : 'Schedules being updated. Contact us for more information.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
