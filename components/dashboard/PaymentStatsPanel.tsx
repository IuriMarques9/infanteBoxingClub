import { CreditCard, Receipt, TrendingUp, AlertCircle } from 'lucide-react'
import StatCard from '@/components/shared/StatCard'
import { getPagamentosStats } from '@/app/dashboard/pagamentos/actions'

// ─── PAINEL DE ESTATÍSTICAS DE PAGAMENTOS ───────────────────────
// Server component: chama getPagamentosStats() e renderiza um
// grid de 4 StatCards com tons distintos. `Recebido este mês` agora
// inclui cotas + seguros + outros tipos do mês corrente. O hint do
// card mostra a divisão entre cotas e seguros.
export default async function PaymentStatsPanel() {
  const { totalMes, totalCotasMes, totalSegurosMes, countMes, receitaPrevista, emAtraso } = await getPagamentosStats()

  const fmt = (n: number) =>
    `${n.toLocaleString('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}€`

  // Hint contextual: só mostra a divisão se houver pelo menos um tipo
  const hintParts: string[] = []
  if (totalCotasMes > 0) hintParts.push(`${fmt(totalCotasMes)} cotas`)
  if (totalSegurosMes > 0) hintParts.push(`${fmt(totalSegurosMes)} seguros`)
  const hint = hintParts.length >= 1 ? hintParts.join(' · ') : undefined

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={CreditCard}
        label="Recebido este mês"
        value={fmt(totalMes)}
        tone="green"
        hint={hint}
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
        hint="cotas dos não-isentos"
      />
      <StatCard
        icon={AlertCircle}
        label="Em atraso"
        value={emAtraso}
        tone="red"
        href="/dashboard/membros?estado=inativo"
      />
    </div>
  )
}
