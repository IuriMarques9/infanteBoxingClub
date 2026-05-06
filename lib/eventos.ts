// ─── Helpers de eventos ───────────────────────────────────────
// Formatação de data/hora a contar com `date_end` opcional e
// `all_day` (esconde a hora). Aplica-se aos componentes da landing
// e do dashboard.

type Lang = 'pt' | 'en'

const LOCALE: Record<Lang, string> = {
  pt: 'pt-PT',
  en: 'en-GB',
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function formatEventDateRange(
  dateIso: string,
  dateEndIso: string | null | undefined,
  lang: Lang = 'pt',
  allDay: boolean = false,
): string {
  const start = new Date(dateIso)
  const end = dateEndIso ? new Date(dateEndIso) : null
  const locale = LOCALE[lang]

  const dateOnlyOpts: Intl.DateTimeFormatOptions = {
    day: 'numeric', month: 'long', year: 'numeric',
  }
  const dateTimeOpts: Intl.DateTimeFormatOptions = {
    ...dateOnlyOpts,
    hour: '2-digit', minute: '2-digit',
  }

  if (allDay) {
    const startFmt = new Intl.DateTimeFormat(locale, dateOnlyOpts).format(start)
    if (!end || sameDay(start, end)) return startFmt
    const sameYear = start.getFullYear() === end.getFullYear()
    const startShort = new Intl.DateTimeFormat(locale, {
      day: 'numeric', month: 'long',
      ...(sameYear ? {} : { year: 'numeric' }),
    }).format(start)
    const endFmt = new Intl.DateTimeFormat(locale, dateOnlyOpts).format(end)
    return `${startShort} – ${endFmt}`
  }

  const longDateTime = new Intl.DateTimeFormat(locale, dateTimeOpts).format(start)
  if (!end) return longDateTime

  if (sameDay(start, end)) {
    const time = new Intl.DateTimeFormat(locale, {
      hour: '2-digit', minute: '2-digit',
    }).format(end)
    return `${longDateTime} – ${time}`
  }

  const sameYear = start.getFullYear() === end.getFullYear()
  const startFmt = new Intl.DateTimeFormat(locale, {
    day: 'numeric', month: 'long',
    ...(sameYear ? {} : { year: 'numeric' }),
    hour: '2-digit', minute: '2-digit',
  }).format(start)
  const endFmt = new Intl.DateTimeFormat(locale, dateTimeOpts).format(end)
  return `${startFmt} – ${endFmt}`
}

// "Passado" inclui date_end: evento só é passado quando o seu fim
// (ou início, se não houver fim) já passou.
export function isEventoPassado(evento: { date: string; date_end: string | null }): boolean {
  const ref = evento.date_end ?? evento.date
  return new Date(ref) < new Date()
}
