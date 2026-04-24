import { CreditCard, Receipt, TrendingUp, AlertCircle } from 'lucide-react'
import StatCard from '@/components/shared/StatCard'
import { getPagamentosStats } from '@/app/dashboard/pagamentos/actions'

// ─── PAINEL DE ESTATÍSTICAS DE PAGAMENTOS ───────────────────────
// Server component: chama getPagamentosStats() e renderiza um
// grid de 4 StatCards com tons distintos.
export default async function PaymentStatsPanel() {
  const { totalMes, countMes, receitaPrevista, emAtraso } = await getPagamentosStats()

  const fmt = (n: number) =>
    `${n.toLocaleString('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}€`

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={CreditCard}
        label="Recebido este mês"
        value={fmt(totalMes)}
        tone="green"
      />
      <StatCard
        icon={Receipt}
        label="Pagamentos registados"
        value={countMes}
        tone="gold"
      />
      <StatCard
        icon={TrendingUp}
        label="Receita prevista"
        value={fmt(receitaPrevista)}
        tone="neutral"
      />
      <StatCard
        icon={AlertCircle}
        label="Em atraso"
        value={emAtraso}
        tone="red"
        href="/dashboard/membros?status=em_atraso"
      />
    </div>
  )
}
