import { createClient } from '@/lib/supabase/server'
import { registarPagamentosLote } from '@/app/dashboard/pagamentos/actions'
import { TURMA_LABELS, type Turma } from '@/app/dashboard/membros/constants'
import { Users } from 'lucide-react'

// ─── FORMULÁRIO DE REGISTO EM LOTE ──────────────────────────────
// Server component. Lista todos os membros agrupados por turma,
// com checkboxes. Permite registar um pagamento para múltiplos
// membros de uma só vez.
export default async function PaymentBatchForm() {
  const supabase = await createClient()

  const { data: membros } = await (supabase.from('membros') as any)
    .select('id, nome, turma, is_isento')
    .order('nome', { ascending: true })

  // Agrupar por turma
  const grupos: Record<string, any[]> = {}
  for (const m of (membros || []) as any[]) {
    const t = m.turma as string
    if (!grupos[t]) grupos[t] = []
    grupos[t].push(m)
  }

  const mesAtual = new Date().toISOString().slice(0, 7)
  const turmas: Turma[] = ['gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres']

  return (
    <div className="bg-[#121212] rounded-2xl border border-white/5 shadow-xl p-6 h-full">
      <h2 className="text-white/90 font-medium mb-1 text-sm uppercase tracking-wider flex items-center gap-2">
        <Users className="w-4 h-4 text-[#E8B55B]" /> Registo em Lote
      </h2>
      <p className="text-white/40 text-xs mb-5">
        Seleciona membros e regista o mesmo pagamento para todos de uma vez.
      </p>

      <form action={registarPagamentosLote} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              Mês de Referência
            </label>
            <input
              type="month"
              name="mes_referencia"
              defaultValue={mesAtual}
              required
              className="w-full px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm [color-scheme:dark]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              Valor (€)
            </label>
            <input
              type="number"
              name="valor"
              step="0.01"
              defaultValue="30"
              required
              className="w-full px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] text-sm"
            />
          </div>
        </div>

        {/* Listagem agrupada */}
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {turmas.map(t => {
            const lista = grupos[t] || []
            if (lista.length === 0) return null
            return (
              <div key={t}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#E8B55B]">
                    {TURMA_LABELS[t]}
                  </p>
                  <span className="text-[10px] text-white/30">{lista.length}</span>
                </div>
                <div className="space-y-1.5">
                  {lista.map((m: any) => (
                    <label
                      key={m.id}
                      className="flex items-center gap-3 p-2.5 bg-white/[0.02] hover:bg-white/5 rounded-lg border border-white/5 cursor-pointer transition-colors text-sm"
                    >
                      <input
                        type="checkbox"
                        name="membro_ids[]"
                        value={m.id}
                        disabled={m.is_isento}
                        className="w-4 h-4 accent-[#E8B55B] disabled:opacity-30"
                      />
                      <span className={`flex-1 ${m.is_isento ? 'text-white/30' : 'text-white/80'}`}>
                        {m.nome}
                        {m.is_isento && (
                          <span className="ml-2 text-[10px] text-blue-400 uppercase tracking-wider">
                            Isento
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-[#E8B55B] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#C99C4A] shadow-[0_0_15px_rgba(232,181,91,0.3)] transition-all"
        >
          Registar em Lote
        </button>
      </form>
    </div>
  )
}
