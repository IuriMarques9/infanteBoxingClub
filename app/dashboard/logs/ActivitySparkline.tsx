'use client'

import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

// ─── SPARKLINE DE ATIVIDADE (D3) ──────────────────────────────
// Recebe 30 dias com contagem de eventos no log e desenha uma linha
// suave para mostrar tendência. Sem eixos a poluir o espaço.
export default function ActivitySparkline({ data }: { data: { date: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0)
  const peak = Math.max(...data.map(d => d.count), 0)
  const peakDay = data.find(d => d.count === peak && peak > 0)

  return (
    <div className="bg-[#121212] rounded-2xl border border-white/5 p-4 sm:p-5 shadow-2xl">
      <div className="flex items-end justify-between mb-3 gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Atividade · 30 dias</p>
          <p className="text-2xl font-bold text-[#E8B55B] mt-0.5">{total} <span className="text-xs font-medium text-white/40">eventos</span></p>
        </div>
        {peak > 0 && peakDay && (
          <p className="text-[10px] text-white/40 text-right">
            Pico: <span className="text-white/70 font-bold">{peak}</span> em <br />
            {new Date(peakDay.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
          </p>
        )}
      </div>
      <div style={{ width: '100%', height: 70 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <XAxis dataKey="date" hide />
            <Tooltip
              cursor={{ stroke: '#E8B55B30' }}
              contentStyle={{
                background: '#0F0F0F',
                border: '1px solid rgba(232, 181, 91, 0.3)',
                borderRadius: 8,
                color: '#fff',
                fontSize: 11,
                padding: '4px 8px',
              }}
              labelFormatter={(label: any) =>
                new Date(label).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
              }
              formatter={(value: any) => [value, 'eventos']}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#E8B55B"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: '#E8B55B' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
