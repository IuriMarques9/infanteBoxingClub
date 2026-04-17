import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { criarMembro } from '../actions'
import { TURMA_LABELS, type Turma } from '../constants'

// ─── FORMULÁRIO DE CRIAÇÃO DE NOVO MEMBRO ──────────────────────
// Este formulário utiliza Server Actions para enviar dados
// diretamente ao Supabase sem necessidade de API Routes.
export const metadata = { title: 'Novo Membro | Dashboard' }

export default function NovoMembroPage() {
  const turmas: Turma[] = ['gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres']

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/membros" className="text-white/50 hover:text-[#E8B55B] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
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

          {/* Email e Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white/70">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="joao@exemplo.pt"
                className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent placeholder:text-white/20 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="telefone" className="text-sm font-medium text-white/70">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                placeholder="912 345 678"
                className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent placeholder:text-white/20 text-sm"
              />
            </div>
          </div>

          {/* Data de Nascimento */}
          <div className="space-y-2">
            <label htmlFor="data_nascimento" className="text-sm font-medium text-white/70">Data de Nascimento</label>
            <input
              id="data_nascimento"
              name="data_nascimento"
              type="date"
              className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent text-sm [color-scheme:dark]"
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
        </div>

        {/* Botões de ação */}
        <div className="flex gap-4 justify-end">
          <Link href="/dashboard/membros" className="px-6 py-3 rounded-xl text-sm font-medium text-white/50 border border-white/10 hover:border-white/20 transition-all">
            Cancelar
          </Link>
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-[#E8B55B] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#C99C4A] shadow-[0_0_15px_rgba(232,181,91,0.3)] hover:shadow-[0_0_25px_rgba(232,181,91,0.6)] transition-all"
          >
            Registar Membro
          </button>
        </div>
      </form>
    </div>
  )
}
