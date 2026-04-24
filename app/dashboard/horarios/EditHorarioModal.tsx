'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit } from 'lucide-react'
import { editarHorario } from './actions'
import { PrimarySubmit } from './SubmitAction'
import { WEEKDAYS, WEEKDAY_LABELS_SHORT, normalizeTime, type WeekDay } from '@/lib/horarios'

interface HorarioProp {
  id: string
  turma: string
  descricao: string
  hora: string
  dias_semana?: string[] | null
  hora_inicio?: string | null
  hora_fim?: string | null
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00', '10', '20', '30', '40', '50']

function splitTime(v: string | null | undefined, fallbackH: string, fallbackM: string) {
  const t = normalizeTime(v)
  if (!t) return { h: fallbackH, m: fallbackM }
  const [h, rawM = '00'] = t.split(':')
  const mNum = parseInt(rawM, 10)
  const rounded = Math.round(mNum / 10) * 10
  const m = String(rounded >= 60 ? 50 : rounded).padStart(2, '0')
  return { h: h.padStart(2, '0'), m }
}

function TimeSelect({ prefix, defaultHour, defaultMinute }: { prefix: string; defaultHour: string; defaultMinute: string }) {
  const selectCls = "min-w-0 px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#E8B55B] [color-scheme:dark]"
  return (
    <div className="flex items-center gap-1.5">
      <select name={`${prefix}_h`} defaultValue={defaultHour} required className={selectCls}>
        {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <span className="text-white/40 text-sm">:</span>
      <select name={`${prefix}_m`} defaultValue={defaultMinute} required className={selectCls}>
        {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>
  )
}

export default function EditHorarioModal({ horario }: { horario: HorarioProp }) {
  const selectedDays = new Set((horario.dias_semana || []).filter(Boolean))
  const inicio = splitTime(horario.hora_inicio, '17', '00')
  const fim = splitTime(horario.hora_fim, '18', '00')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-white/40 hover:text-[#E8B55B] transition-colors p-1 rounded hover:bg-[#E8B55B]/10"
          aria-label="Editar horário"
        >
          <Edit className="w-3 h-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#121212] border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#E8B55B] font-headline tracking-wider uppercase">Editar Horário</DialogTitle>
        </DialogHeader>
        <form action={editarHorario} className="space-y-5">
          <input type="hidden" name="id" value={horario.id} />

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em]">Dias da semana</label>
            <div className="flex flex-wrap gap-1.5">
              {WEEKDAYS.map(d => (
                <label key={d} className="cursor-pointer">
                  <input
                    type="checkbox"
                    name="dias_semana"
                    value={d}
                    defaultChecked={selectedDays.has(d)}
                    className="peer sr-only"
                  />
                  <span className="px-2.5 py-1.5 rounded-md border border-white/10 bg-black/30 text-[11px] font-bold text-white/50 uppercase tracking-wider block peer-checked:bg-[#E8B55B]/20 peer-checked:text-[#E8B55B] peer-checked:border-[#E8B55B]/40 transition-colors">
                    {WEEKDAY_LABELS_SHORT.pt[d as WeekDay]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em]">Início</label>
              <TimeSelect prefix="hora_inicio" defaultHour={inicio.h} defaultMinute={inicio.m} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em]">Fim</label>
              <TimeSelect prefix="hora_fim" defaultHour={fim.h} defaultMinute={fim.m} />
            </div>
          </div>

          <PrimarySubmit>Guardar</PrimarySubmit>
        </form>
      </DialogContent>
    </Dialog>
  )
}
