'use client'

import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { MES_LABEL_PT } from '@/lib/payments'

interface Props {
  data: { mes: string; atual: number; anterior: number }[]
  thisYear: number
}

export default function YoYChart({ data, thisYear }: Props) {
  // Soma total ano-a-data (até ao último mês com valor > 0 do ano actual)
  const totalAtual = data.reduce((s, d) => s + d.atual, 0)
  const totalAnteriorMesmoIntervalo = data
    .filter((_, i) => i < (data.findLastIndex(d => d.atual > 0) + 1 || 12))
    .reduce((s, d) => s + d.anterior, 0)

  const delta = totalAnteriorMesmoIntervalo > 0
    ? Math.round(((totalAtual - totalAnteriorMesmoIntervalo) / totalAnteriorMesmoIntervalo) * 100)
    : null

  const DeltaIcon = delta === null || delta === 0 ? Minus : delta > 0 ? TrendingUp : TrendingDown
  const deltaColor = delta === null ? 'text-white/40' : delta >= 0 ? 'text-emerald-400' : 'text-red-400'

  // Formatar para o eixo X
  const chartData = data.map(d => ({
    ...d,
    label: MES_LABEL_PT[d.mes] ?? d.mes,
  }))

  return (
    <div className="bg-[#121212] rounded-2xl border border-white/5 p-5 sm:p-6 shadow-2xl">
      <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Comparação anual</p>
          <p className="text-2xl font-bold text-[#E8B55B] mt-0.5">
            {totalAtual}€
            <span className="text-xs font-medium text-white/40 ml-2">total {thisYear}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">vs {thisYear - 1}</p>
          <p className={`text-sm font-bold mt-0.5 inline-flex items-center gap-1.5 ${deltaColor}`}>
            <DeltaIcon className="w-3.5 h-3.5" />
            {delta === null ? '—' : `${delta >= 0 ? '+' : ''}${delta}%`}
          </p>
          <p className="text-[10px] text-white/40 mt-0.5">{totalAnteriorMesmoIntervalo}€ no mesmo período</p>
        </div>
      </div>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
            <Tooltip
              contentStyle={{
                background: '#0F0F0F',
                border: '1px solid rgba(232,181,91,0.3)',
                borderRadius: 8,
                color: '#fff',
                fontSize: 11,
              }}
              formatter={(value: any) => `${value}€`}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" />
            <Line
              type="monotone"
              dataKey="anterior"
              name={`${thisYear - 1}`}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="atual"
              name={`${thisYear}`}
              stroke="#E8B55B"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#E8B55B' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
