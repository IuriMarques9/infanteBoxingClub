import { createClient } from '@/lib/supabase/server'
import { TURMA_LABELS, type Turma } from '../membros/constants'
import { criarHorario, eliminarHorario, removerDiaHorario, duplicarDiaHorario, migrarHorarioLegacy } from './actions'
import EditHorarioModal from './EditHorarioModal'
import { DeleteButton, AddSubmit } from './SubmitAction'
import DuplicarDiaButton from './DuplicarDiaButton'
import {
  WEEKDAY_LABELS_SHORT,
  WEEKDAY_LABELS_LONG,
  TURMA_AGENDA_TONES,
  TURMA_ACCENT_DOT,
  collectActiveDays,
  collectTimeRanges,
  findSlots,
  type WeekDay,
} from '@/lib/horarios'
import { cn } from '@/lib/utils'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00', '10', '20', '30', '40', '50']

function TimeSelect({ prefix, defaultHour = '17', defaultMinute = '00' }: { prefix: string; defaultHour?: string; defaultMinute?: string }) {
  // text-base em mobile evita o auto-zoom do iOS quando o select recebe foco
  const selectCls = "min-w-0 px-2.5 py-2 sm:py-1.5 bg-black/30 text-white border border-white/10 rounded-md text-base sm:text-xs focus:outline-none focus:border-[#E8B55B]/40 [color-scheme:dark]"
  return (
    <div className="flex items-center gap-1">
      <select name={`${prefix}_h`} defaultValue={defaultHour} required className={selectCls}>
        {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <span className="text-white/40 text-xs">:</span>
      <select name={`${prefix}_m`} defaultValue={defaultMinute} required className={selectCls}>
        {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>
  )
}

export const metadata = { title: 'Horários | Dashboard' }

interface HorarioRow {
  id: string
  turma: Turma
  descricao: string
  hora: string
  dias_semana: string[] | null
  hora_inicio: string | null
  hora_fim: string | null
}

const DEFAULT_DAYS: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri']
const ALL_DAYS_FOR_PICKER: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export default async function HorariosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; detail?: string }>
}) {
  const searchParamsData = await searchParams
  const supabase = await createClient()

  const { data: horariosData } = await (supabase
    .from('horarios')
    .select('*')
    .order('turma', { ascending: true }) as any)

  const horarios: HorarioRow[] = (horariosData || []) as HorarioRow[]
  const turmas: Turma[] = ['gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres']

  const activeDays = collectActiveDays(horarios)
  const timeRanges = collectTimeRanges(horarios)
  const extraDays = activeDays.filter(d => !DEFAULT_DAYS.includes(d))
  const columns: WeekDay[] = [...DEFAULT_DAYS, ...extraDays]
  const hasData = timeRanges.length > 0

  const legacyRows = horarios.filter(h => !h.dias_semana || h.dias_semana.length === 0 || !h.hora_inicio)

  const errorMessages: Record<string, string> = {
    missing_fields:  'Escolhe pelo menos um dia e preenche hora de início e fim.',
    create_failed:   'Não foi possível criar o horário. Tenta novamente.',
    update_failed:   'Não foi possível guardar as alterações.',
    conflict:        'Conflito: já existe um horário desta turma sobreposto.',
    migrate_failed:  'Não foi possível migrar este horário automaticamente.',
  }
  const errorMsg = searchParamsData?.error ? (errorMessages[searchParamsData.error] || 'Ocorreu um erro.') : null

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-[#E8B55B] tracking-wider">
          Horários e Turmas
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Pré-visualização igual à Landing Page. Adiciona aulas por turma em baixo; passa o rato sobre uma célula para editar ou remover.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm space-y-1">
          <div>{errorMsg}</div>
          {searchParamsData?.detail && (
            <div className="text-[11px] font-mono text-red-300/80 break-all">
              Detalhe: {searchParamsData.detail}
            </div>
          )}
        </div>
      )}

      {/* MATRIX PREVIEW — same as landing */}
      <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-[#E8B55B]/5 border-b border-white/5">
                <th className="px-4 py-4 text-left font-headline uppercase tracking-[0.25em] text-[#E8B55B] text-xs font-bold w-[140px]">
                  Hora
                </th>
                {columns.map(day => (
                  <th
                    key={day}
                    className="px-3 py-4 text-center font-headline uppercase tracking-[0.25em] text-[#E8B55B] text-xs font-bold"
                  >
                    <div>{WEEKDAY_LABELS_SHORT.pt[day]}</div>
                    <div className="text-[10px] font-normal tracking-wider text-white/40 mt-0.5 normal-case">
                      {WEEKDAY_LABELS_LONG.pt[day]}
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
                    <td className="px-4 py-3 font-headline text-[#E8B55B] text-sm font-bold tracking-wider whitespace-nowrap">
                      {range.inicio} – {range.fim}
                    </td>
                    {columns.map(day => {
                      const slots = findSlots(horarios, day, range)
                      return (
                        <td key={day} className="px-2 py-2 align-middle">
                          {slots.length > 0 ? (
                            <div className="space-y-1">
                              {slots.map(slot => (
                                <div
                                  key={slot.id}
                                  className={cn(
                                    "rounded-lg border p-2 text-center group/slot relative",
                                    TURMA_AGENDA_TONES[slot.turma]
                                  )}
                                >
                                  <div className="uppercase tracking-wider text-[10px] font-bold leading-tight">
                                    {TURMA_LABELS[slot.turma]}
                                  </div>
                                  <div className="absolute top-0.5 right-0.5 flex items-center gap-0.5 opacity-0 group-hover/slot:opacity-100 focus-within:opacity-100 transition-opacity">
                                    <DuplicarDiaButton id={slot.id} diasJaCobertos={slot.dias_semana || []} />
                                    <EditHorarioModal horario={slot} />
                                    <form action={removerDiaHorario}>
                                      <input type="hidden" name="id" value={slot.id} />
                                      <input type="hidden" name="dia" value={day} />
                                      <DeleteButton ariaLabel={`Remover ${WEEKDAY_LABELS_LONG.pt[day]} deste horário`} />
                                    </form>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center text-white/15 text-sm select-none">—</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-16 text-center text-white/30 text-sm italic">
                    Ainda não há aulas com dias/horas definidos. Usa os formulários em baixo para adicionar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORMS DE ADIÇÃO por turma */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-4">Adicionar horário</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {turmas.map(turma => (
            <form
              key={turma}
              action={criarHorario}
              className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-3 transition-colors overflow-hidden hover:bg-white/[0.035] text-white/80"
            >
              <span className={cn("absolute left-0 top-0 bottom-0 w-1", TURMA_ACCENT_DOT[turma])} />
              <input type="hidden" name="turma" value={turma} />
              <div className="flex items-center gap-2.5 pl-1">
                <span className="font-headline uppercase tracking-wider text-sm font-bold">
                  {TURMA_LABELS[turma]}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 pl-1">
                {ALL_DAYS_FOR_PICKER.map(d => (
                  <label key={d} className="cursor-pointer">
                    <input type="checkbox" name="dias_semana" value={d} className="peer sr-only" />
                    <span className="px-2 py-1 rounded-md border border-white/10 bg-black/30 text-[10px] font-bold text-white/50 uppercase tracking-wider block peer-checked:bg-[#E8B55B]/20 peer-checked:text-[#E8B55B] peer-checked:border-[#E8B55B]/40 transition-colors">
                      {WEEKDAY_LABELS_SHORT.pt[d]}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap pl-1">
                <TimeSelect prefix="hora_inicio" defaultHour="17" defaultMinute="00" />
                <span className="text-white/30 text-xs">–</span>
                <TimeSelect prefix="hora_fim" defaultHour="18" defaultMinute="00" />
                <AddSubmit ariaLabel={`Adicionar horário ${TURMA_LABELS[turma]}`} />
              </div>
            </form>
          ))}
        </div>
      </div>

      {legacyRows.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl space-y-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300">
              Horários antigos — precisam de migração
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Estes horários foram criados antes da matriz semanal e não aparecem na tabela acima nem na landing page. Edita cada um para definir dias + horas estruturados, ou elimina.
            </p>
          </div>
          <div className="space-y-2">
            {legacyRows.map(h => (
              <div key={h.id} className="flex items-center justify-between bg-black/30 border border-white/5 rounded-lg px-4 py-3 text-sm">
                <div>
                  <span className="text-[#E8B55B] font-semibold uppercase tracking-wide text-xs">{TURMA_LABELS[h.turma]}</span>
                  <span className="text-white/70 ml-3">{h.descricao || '—'} · {h.hora || '—'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <form action={migrarHorarioLegacy}>
                    <input type="hidden" name="id" value={h.id} />
                    <button
                      type="submit"
                      title="Tentar converter automaticamente para o novo formato"
                      className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded hover:bg-amber-500/20 transition-colors"
                    >
                      Migrar
                    </button>
                  </form>
                  <EditHorarioModal horario={h} />
                  <form action={eliminarHorario}>
                    <input type="hidden" name="id" value={h.id} />
                    <DeleteButton ariaLabel="Eliminar" size="md" />
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
