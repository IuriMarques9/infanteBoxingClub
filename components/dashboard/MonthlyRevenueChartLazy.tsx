'use client'

import dynamic from 'next/dynamic'

const MonthlyRevenueChart = dynamic(() => import('./MonthlyRevenueChart'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-white/[0.02] rounded-lg animate-pulse" />,
})

export default function MonthlyRevenueChartLazy({
  data,
}: {
  data: { mes: string; total: number }[]
}) {
  return <MonthlyRevenueChart data={data} />
}
