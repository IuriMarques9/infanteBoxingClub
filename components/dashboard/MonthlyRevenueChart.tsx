'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ─── GRÁFICO DE RECEITA MENSAL ──────────────────────────────────
// Recebe 12 pontos (um por mês, "YYYY-MM") e renderiza um BarChart
// com o total recebido por mês.
export default function MonthlyRevenueChart({
  data,
}: {
  data: { mes: string; total: number }[]
}) {
  // Simplificar o label para "Jan", "Fev"...
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const chartData = data.map(d => {
    const m = parseInt(d.mes.slice(5, 7), 10)
    return { ...d, label: meses[m - 1] || d.mes }
  })

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#ffffff60"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#ffffff60"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}€`}
          />
          <Tooltip
            cursor={{ fill: '#E8B55B10' }}
            contentStyle={{
              background: '#0F0F0F',
              border: '1px solid rgba(232, 181, 91, 0.3)',
              borderRadius: 12,
              color: '#fff',
              fontSize: 12,
            }}
            labelStyle={{ color: '#E8B55B', fontWeight: 700 }}
            formatter={(value: any) => [`${value}€`, 'Total']}
          />
          <Bar dataKey="total" fill="#E8B55B" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
