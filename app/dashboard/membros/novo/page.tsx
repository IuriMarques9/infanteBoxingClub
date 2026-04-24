import Link from 'next/link'
import { criarMembro } from '../actions'
import { TURMA_LABELS, COTAS_SUGERIDAS, SEGURO_LABELS, type Turma, type SeguroPago } from '../constants'
import { anoAtual } from '@/lib/membros-estado'
import { SubmitPrimary } from '@/components/dashboard/FormButtons'
import { BackLink } from '@/components/dashboard/PendingLink'

// ─── FORMULÁRIO DE CRIAÇÃO DE NOVO MEMBRO ──────────────────────
// Este formulário utiliza Server Actions para enviar dados
// diretamente ao Supabase sem necessidade de API Routes.
export const metadata = { title: 'Novo Membro | Dashboard' }

export default function NovoMembroPage() {
  const turmas: Turma[] = ['gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres']
  const ano = anoAtual()

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <BackLink href="/dashboard/membros" />
        <div>
          <h1 className="text-2xl font-headline font-bold text-[#E8B55B] tracking-wider">
            Novo Membro
          </h1>
          <p className="text-white/40 text-sm mt-0.5">
            Preenche os dados do novo sócio
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form action={criarMembro} className="space-y-6">
        <div className="bg-[#121212] rounded-2xl border border-white/5 p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          
          {/* Nome (Obrigatório) */}
          <div className="space-y-2">
            <label htmlFor="nome" className="text-sm font-medium text-white/70">Nome Completo *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              placeholder="Ex: João Silva"
              className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent placeholder:text-white/20 text-sm"
            />
          </div>

          {/* Turma (Obrigatório) */}
          <div className="space-y-2">
            <label htmlFor="turma" className="text-sm font-medium text-white/70">Turma *</label>
            <select
              id="turma"
              name="turma"
              required
              className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent text-sm appearance-none cursor-pointer"
            >
              <option value="" disabled>Seleciona a turma</option>
              {turmas.map(t => (
                <option key={t} value={t}>{TURMA_LABELS[t]}</option>
              ))}
            </select>
          </div>

          {/* Toggle de Competição */}
          <div className="flex items-center gap-4 p-4 bg-[#E8B55B]/5 rounded-xl border border-[#E8B55B]/10">
            <input
              id="is_competicao"
              name="is_competicao"
              type="checkbox"
              className="w-5 h-5 accent-[#E8B55B] rounded bg-[#1A1A1A] border-[#333333]"
            />
            <label htmlFor="is_competicao" className="text-sm font-medium text-white/80 cursor-pointer">
              Atleta de Competição 🏆
              <span className="block text-xs text-white/40 mt-0.5">Marcar se o membro participa em competições oficiais.</span>
            </label>
          </div>

          {/* Toggle de Isenção */}
          <div className="flex items-center gap-4 p-4 bg-blue-400/5 rounded-xl border border-blue-400/10">
            <input
              id="is_isento"
              name="is_isento"
              type="checkbox"
              className="w-5 h-5 accent-blue-400 rounded bg-[#1A1A1A] border-[#333333]"
            />
            <label htmlFor="is_isento" className="text-sm font-medium text-white/80 cursor-pointer">
              Membro Isento 🛡️
              <span className="block text-xs text-white/40 mt-0.5">Marcar se o membro está isento de pagamento de mensalidade.</span>
            </label>
          </div>

          {/* Cota */}
          <div className="space-y-2">
            <label htmlFor="cota" className="text-sm font-medium text-white/70">Cota (€)</label>
            <input
              id="cota"
              name="cota"
              type="number"
              step="0.01"
              min="0"
              list="cotas-sugeridas"
              defaultValue={30}
              className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent text-sm"
            />
            <datalist id="cotas-sugeridas">
              {COTAS_SUGERIDAS.map(v => <option key={v} value={v} />)}
            </datalist>
          </div>

          {/* Seguro (anual) — Inspeção Médica é derivada do upload do ficheiro */}
          <div className="space-y-2">
            <label htmlFor="seguro_pago" className="text-sm font-medium text-white/70">
              Seguro Pago ({ano})
            </label>
            <select
              id="seguro_pago"
              name="seguro_pago"
              defaultValue=""
              className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent text-sm appearance-none cursor-pointer"
            >
              <option value="">🚫 Não Pago</option>
              {(Object.keys(SEGURO_LABELS) as SeguroPago[]).map(s => (
                <option key={s} value={s}>{SEGURO_LABELS[s]}</option>
              ))}
            </select>
            <p className="text-[11px] text-white/30">Reinicia automaticamente em Janeiro.</p>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <label htmlFor="observacoes" className="text-sm font-medium text-white/70">Observações</label>
            <textarea
              id="observacoes"
              name="observacoes"
              rows={3}
              placeholder="Notas internas sobre o sócio..."
              className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent placeholder:text-white/20 text-sm resize-none"
            />
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-4 justify-end">
          <Link href="/dashboard/membros" className="px-6 py-3 rounded-xl text-sm font-medium text-white/50 border border-white/10 hover:border-white/20 transition-all">
            Cancelar
          </Link>
          <div className="w-auto">
            <SubmitPrimary pendingLabel="A registar…" className="w-auto px-8">
              Registar Membro
            </SubmitPrimary>
          </div>
        </div>
      </form>
    </div>
  )
}
