import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'
import { TrendingUp, BarChart3 } from 'lucide-react'
import PaymentStatsPanel from '@/components/dashboard/PaymentStatsPanel'
import ExportCSVButton from '@/components/dashboard/ExportCSVButton'
import PagamentosHeader from './PagamentosHeader'
import PagamentosTable from './PagamentosTable'
import DevedoresList from './DevedoresList'
import TopDevedoresTable from './TopDevedoresTable'
import {
  getRelatorioMensal,
  getReceitaAnual,
  compararAnosYoY,
  getDevedoresDoMes,
  getTopDevedores,
  listarPagamentos,
} from './actions'
import { mesActual, type PagamentoTipo } from '@/lib/payments'

// recharts pesado — só carrega ao visitar esta página
const MonthlyRevenueChart = dynamic(
  () => import('@/components/dashboard/MonthlyRevenueChart'),
  { loading: () => <div className="h-[300px] bg-white/[0.02] rounded-lg animate-pulse" /> },
)
const YoYChart = dynamic(
  () => import('@/components/dashboard/YoYChart'),
  { loading: () => <div className="h-[260px] bg-white/[0.02] rounded-lg animate-pulse" /> },
)

export const metadata = { title: 'Pagamentos | Dashboard' }

const PAGE_SIZE = 50

type SearchParams = {
  ano?: string
  tipo?: PagamentoTipo
  from?: string
  to?: string
  membro?: string
  turma?: string
  page?: string
}

export default async function PagamentosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const currentYear = new Date().getFullYear()
  const ano = parseInt(sp.ano ?? `${currentYear}`, 10) || currentYear
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1)
  const mesAt = mesActual()

  // Server fetches (paralelos)
  const supabase = await createClient()

  const [
    { data: membrosData },
    relatorioMensal,
    yoyData,
    receita,
    devedoresMes,
    topDev,
    pagamentosListed,
  ] = await Promise.all([
    (supabase.from('membros') as any)
      .select('id, nome, turma, is_isento, is_competicao')
      .order('nome', { ascending: true }),
    getRelatorioMensal(ano),
    compararAnosYoY(ano),
    getReceitaAnual(ano),
    // Só mostrar devedores se estamos a ver o ano corrente
    ano === currentYear ? getDevedoresDoMes(mesAt, 50) : Promise.resolve([]),
    getTopDevedores(ano, 10),
    listarPagamentos({
      tipo: sp.tipo,
      from: sp.from,
      to: sp.to,
      membroId: sp.membro,
      turma: sp.turma,
      page,
      pageSize: PAGE_SIZE,
    }),
  ])

  const membros = (membrosData || []) as any[]

  // Receita prevista anual = previstoMensal × 12 (estimativa simples)
  const receitaPrevistaAnual = receita.previstoMensal * 12
  const percentReceita = receitaPrevistaAnual > 0
    ? Math.min(100, Math.round((receita.acumulado / receitaPrevistaAnual) * 100))
    : 0

  // Default range CSV: ano todo
  const csvFrom = sp.from ?? `${ano}-01`
  const csvTo = sp.to ?? `${ano}-12`

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <PagamentosHeader year={ano} membros={membros} />

      {/* KPIs */}
      <PaymentStatsPanel />

      {/* Receita acumulada anual */}
      <div className="bg-[#121212] rounded-2xl border border-white/5 p-5 sm:p-6 shadow-2xl">
        <div className="flex items-end justify-between gap-3 mb-3 flex-wrap">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" /> Receita acumulada · {ano}
            </p>
            <p className="text-3xl font-bold text-[#E8B55B] mt-1">
              {receita.acumulado}€
              <span className="text-xs font-medium text-white/40 ml-2">
                de {receitaPrevistaAnual}€ previstos
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${percentReceita >= 80 ? 'text-emerald-400' : percentReceita >= 50 ? 'text-[#E8B55B]' : 'text-amber-300'}`}>
              {percentReceita}%
            </p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">do previsto</p>
          </div>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E8B55B] to-emerald-400 transition-all"
            style={{ width: `${percentReceita}%` }}
          />
        </div>
      </div>

      {/* Gráfico mensal */}
      <div className="bg-[#121212] rounded-2xl border border-white/5 p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#E8B55B] flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Receita Mensal · {ano}
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
            Total: {relatorioMensal.reduce((s, m) => s + m.total, 0)}€
          </span>
        </div>
        <MonthlyRevenueChart data={relatorioMensal} />
      </div>

      {/* YoY */}
      <YoYChart data={yoyData} thisYear={ano} />

      {/* Devedores deste mês + Top devedores em grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DevedoresList
            devedores={devedoresMes}
            mes={mesAt}
            total={devedoresMes.length}
          />
        </div>
        <div>
          <TopDevedoresTable devedores={topDev} year={ano} />
        </div>
      </div>

      {/* Tabela completa + Export */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">Histórico de Pagamentos</h2>
          <ExportCSVButton from={csvFrom} to={csvTo} membroId={sp.membro} />
        </div>
        <PagamentosTable
          pagamentos={pagamentosListed.rows}
          total={pagamentosListed.total}
          page={page}
          pageSize={PAGE_SIZE}
          membrosFilter={membros.map(m => ({ id: m.id, nome: m.nome }))}
        />
      </div>

      <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold text-center">
        Tesouraria Infante Boxing CRM · Acesso Restrito
      </p>
    </div>
  )
}
