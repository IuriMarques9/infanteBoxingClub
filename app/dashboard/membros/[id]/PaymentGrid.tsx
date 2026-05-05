import { CreditCard } from 'lucide-react'
import { registarPagamento, eliminarPagamento } from '../actions'
import { anoAtual } from '@/lib/membros-estado'
import { SubmitPaymentCheck, SubmitPaymentDelete } from '@/components/dashboard/FormButtons'

const MESES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const MESES_PT_CURTO = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

interface Pagamento {
  id: string
  /** Pode ser NULL para tipos não-cota (seguro, loja, evento, outro). */
  mes_referencia: string | null
  valor: number | string
  data_pagamento?: string
}

interface Membro {
  id: string
  cota?: number | null
}

export default function PaymentGrid({
  membro,
  pagamentos,
  ano,
}: {
  membro: Membro
  pagamentos: Pagamento[]
  ano: number
}) {
  const anoStr = String(ano)
  const cotaDefault = membro.cota ?? 30
  const anosHistorico: number[] = []
  const agora = anoAtual()
  for (let y = agora; y >= agora - 5; y--) anosHistorico.push(y)
  if (!anosHistorico.includes(ano)) anosHistorico.push(ano)

  // Filtrar só cotas do ano (seguros e outros tipos têm mes_referencia=NULL).
  const porMes = new Map<string, Pagamento>()
  pagamentos
    .filter(p => p.mes_referencia?.startsWith(`${anoStr}-`))
    .forEach(p => porMes.set(p.mes_referencia!, p))

  return (
    <div className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-white/90 font-medium text-sm uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#E8B55B]" /> Pagamentos {anoStr}
        </h2>
        <form method="GET" className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Ano</label>
          <select
            name="ano"
            defaultValue={anoStr}
            className="px-3 py-1.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-xs appearance-none cursor-pointer"
          >
            {anosHistorico.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 transition-all"
          >
            Ver
          </button>
        </form>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {MESES_PT.map((nome, idx) => {
          const mm = String(idx + 1).padStart(2, '0')
          const mesRef = `${anoStr}-${mm}`
          const pag = porMes.get(mesRef)
          if (pag) {
            return (
              <div
                key={mesRef}
                className="group relative bg-green-500/10 border border-green-500/30 rounded-xl p-3 flex flex-col items-center justify-center text-center min-h-[82px]"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-400/70">
                  {MESES_PT_CURTO[idx]}
                </span>
                <span className="text-sm font-bold text-green-400 mt-1">{Number(pag.valor)}€</span>
                <form action={eliminarPagamento} className="absolute top-1.5 right-1.5">
                  <input type="hidden" name="pagamento_id" value={pag.id} />
                  <input type="hidden" name="membro_id" value={membro.id} />
                  <SubmitPaymentDelete ariaLabel={`Remover pagamento de ${nome}`} />
                </form>
              </div>
            )
          }
          return (
            <form
              key={mesRef}
              action={registarPagamento}
              className="bg-white/[0.02] border border-white/5 hover:border-[#E8B55B]/30 rounded-xl p-3 flex flex-col items-center justify-center text-center min-h-[82px] transition-all"
            >
              <input type="hidden" name="membro_id" value={membro.id} />
              <input type="hidden" name="mes_referencia" value={mesRef} />
              <input type="hidden" name="valor" value={cotaDefault} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                {MESES_PT_CURTO[idx]}
              </span>
              <span className="text-sm font-bold text-white/50 mt-1">{Number(cotaDefault)}€</span>
              <SubmitPaymentCheck ariaLabel={`Confirmar pagamento de ${nome}`} />
            </form>
          )
        })}
      </div>
    </div>
  )
}
