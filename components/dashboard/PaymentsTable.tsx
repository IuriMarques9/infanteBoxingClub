import ExportCSVButton from './ExportCSVButton'
import { Filter } from 'lucide-react'

// ─── TABELA DE PAGAMENTOS ───────────────────────────────────────
// Server component. Mostra uma barra de filtro por intervalo de
// meses (GET form), um botão de exportação CSV e a tabela com os
// pagamentos já filtrados.
export default function PaymentsTable({
  pagamentos,
  from,
  to,
}: {
  pagamentos: any[]
  from: string
  to: string
}) {
  return (
    <div className="bg-[#121212] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
      {/* Barra de filtros */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 p-6 border-b border-white/5">
        <form method="GET" className="flex flex-col md:flex-row gap-3 flex-1">
          <div className="space-y-1 flex-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
              <Filter className="w-3 h-3" /> De
            </label>
            <input
              type="month"
              name="from"
              defaultValue={from}
              className="w-full px-4 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm [color-scheme:dark]"
            />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              Até
            </label>
            <input
              type="month"
              name="to"
              defaultValue={to}
              className="w-full px-4 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm [color-scheme:dark]"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 transition-all"
            >
              Filtrar
            </button>
          </div>
        </form>

        <div className="flex items-end">
          <ExportCSVButton from={from} to={to} />
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Mês</th>
              <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Membro</th>
              <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Valor</th>
              <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center px-6 py-12 text-white/30">
                  Sem pagamentos no intervalo selecionado.
                </td>
              </tr>
            ) : (
              pagamentos.map((p: any) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 text-white/80 font-medium">{p.mes_referencia}</td>
                  <td className="px-6 py-3 text-white/70">{p.membros?.nome || '—'}</td>
                  <td className="px-6 py-3 font-bold text-green-400">{p.valor}€</td>
                  <td className="px-6 py-3 text-white/50 text-xs">
                    {p.data_pagamento ? new Date(p.data_pagamento).toLocaleDateString('pt-PT') : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
