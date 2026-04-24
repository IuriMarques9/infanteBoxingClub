import type { Turma } from "@/app/dashboard/membros/constants";

export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type WeekDay = typeof WEEKDAYS[number];

export const WEEKDAY_LABELS_SHORT: Record<"pt" | "en", Record<WeekDay, string>> = {
  pt: { mon: "Seg", tue: "Ter", wed: "Qua", thu: "Qui", fri: "Sex", sat: "Sáb", sun: "Dom" },
  en: { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" },
};

export const WEEKDAY_LABELS_LONG: Record<"pt" | "en", Record<WeekDay, string>> = {
  pt: { mon: "Segunda", tue: "Terça", wed: "Quarta", thu: "Quinta", fri: "Sexta", sat: "Sábado", sun: "Domingo" },
  en: { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" },
};

export const TURMA_AGENDA_TONES: Record<Turma, string> = {
  gatinhos:  "bg-emerald-500/25 text-emerald-100 border-emerald-500/50",
  suricatas: "bg-amber-400/25 text-amber-100 border-amber-400/50",
  leoes:     "bg-green-700/35 text-green-100 border-green-600/55",
  adultos:   "bg-zinc-600/40 text-zinc-100 border-zinc-500/60",
  mulheres:  "bg-rose-400/25 text-rose-100 border-rose-400/50",
};

export const TURMA_ACCENT_DOT: Record<Turma, string> = {
  gatinhos:  "bg-emerald-400",
  suricatas: "bg-amber-300",
  leoes:     "bg-green-600",
  adultos:   "bg-zinc-400",
  mulheres:  "bg-rose-300",
};

export function sortWeekdays(days: WeekDay[]): WeekDay[] {
  return [...days].sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b));
}

export function buildDescricao(days: WeekDay[], lang: "pt" | "en" = "pt"): string {
  const labels = WEEKDAY_LABELS_LONG[lang];
  const ordered = sortWeekdays(days);
  if (ordered.length === 0) return "";
  if (ordered.length === 1) return labels[ordered[0]];
  const head = ordered.slice(0, -1).map(d => labels[d]).join(", ");
  const tail = labels[ordered[ordered.length - 1]];
  return lang === "pt" ? `${head} e ${tail}` : `${head} and ${tail}`;
}

export function buildHora(inicio: string, fim: string, lang: "pt" | "en" = "pt"): string {
  const i = inicio.slice(0, 5);
  const f = fim.slice(0, 5);
  return lang === "pt" ? `${i} às ${f}` : `${i} to ${f}`;
}

export function normalizeTime(v: string | null | undefined): string {
  if (!v) return "";
  return v.slice(0, 5);
}

export interface TimeRange {
  inicio: string;
  fim: string;
  key: string;
}

interface HorarioLike {
  turma: Turma;
  dias_semana?: string[] | null;
  hora_inicio?: string | null;
  hora_fim?: string | null;
}

export function collectTimeRanges(horarios: HorarioLike[]): TimeRange[] {
  const map = new Map<string, TimeRange>();
  for (const h of horarios) {
    if (!h.hora_inicio || !h.hora_fim || !h.dias_semana || h.dias_semana.length === 0) continue;
    const inicio = normalizeTime(h.hora_inicio);
    const fim = normalizeTime(h.hora_fim);
    const key = `${inicio}-${fim}`;
    if (!map.has(key)) map.set(key, { inicio, fim, key });
  }
  return [...map.values()].sort((a, b) => a.inicio.localeCompare(b.inicio));
}

export function collectActiveDays(horarios: HorarioLike[]): WeekDay[] {
  const set = new Set<WeekDay>();
  for (const h of horarios) {
    if (!h.hora_inicio || !h.hora_fim || !h.dias_semana) continue;
    for (const raw of h.dias_semana) {
      const d = raw as WeekDay;
      if ((WEEKDAYS as readonly string[]).includes(d)) set.add(d);
    }
  }
  return sortWeekdays([...set]);
}

export function findSlot<T extends HorarioLike>(horarios: T[], day: WeekDay, range: TimeRange): T | null {
  for (const h of horarios) {
    if (!h.hora_inicio || !h.hora_fim || !h.dias_semana) continue;
    if (normalizeTime(h.hora_inicio) !== range.inicio) continue;
    if (normalizeTime(h.hora_fim) !== range.fim) continue;
    if (!h.dias_semana.includes(day)) continue;
    return h;
  }
  return null;
}
