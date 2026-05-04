'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { X, Loader2, CreditCard, Shield, MoreHorizontal, AlertTriangle } from 'lucide-react'
import { SEGURO_VALORES } from '@/lib/payments'
import { TURMA_LABELS, type Turma } from '@/app/dashboard/membros/constants'
import { registarSeguro, registarPagamento, registarPagamentosLote } from '@/app/dashboard/pagamentos/actions'

// ─── PAYMENT REGISTER MODAL ─────────────────────────────────────
// Modal universal para registar qualquer tipo de pagamento. Aparece
// 3 separadores no topo: Cota | Seguro | Outro. Cada um adapta o
// formulário às regras desse tipo.
//
//   - Cota:   multi-membro (não-isentos) + mês + valor (lote)
//   - Seguro: 1 membro + radio 32/45 € + ano + método. Aviso visual
//             se 45€ (vai marcar is_competicao=true).
//   - Outro:  1 membro + valor + descrição livre.

interface MembroOption {
  id: string
  nome: string
  turma: Turma
  is_isento: boolean
  is_competicao: boolean
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Lista completa de membros (passada pela page para evitar refetch). */
  membros: MembroOption[]
  /** Tipo inicial seleccionado (default 'cota'). */
  defaultTipo?: 'cota' | 'seguro' | 'outro'
  /** Pré-seleccionar um membro (útil quando vem da ficha). */
  defaultMembroId?: string
}

export default function PaymentRegisterModal({
  open,
  onOpenChange,
  membros,
  defaultTipo = 'cota',
  defaultMembroId,
}: Props) {
  const router = useRouter()
  const [tipo, setTipo] = useState<'cota' | 'seguro' | 'outro'>(defaultTipo)
  const [pending, start] = useTransition()

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={() => !pending && onOpenChange(false)}
    >
      <div
        className="bg-[#121212] border border-[#E8B55B]/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/5">
          <div>
            <h3 className="text-lg font-headline font-bold text-[#E8B55B] tracking-wider">Registar Pagamento</h3>
            <p className="text-white/50 text-xs mt-1">Escolhe o tipo e preenche os detalhes.</p>
          </div>
          <button
            type="button"
            onClick={() => !pending && onOpenChange(false)}
            aria-label="Fechar"
            className="w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/5 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tipo tabs */}
        <div className="px-6 pt-4 flex gap-2 border-b border-white/5">
          <TipoTab active={tipo === 'cota'}   onClick={() => setTipo('cota')}   icon={CreditCard}      label="Cota mensal" />
          <TipoTab active={tipo === 'seguro'} onClick={() => setTipo('seguro')} icon={Shield}          label="Seguro anual" />
          <TipoTab active={tipo === 'outro'}  onClick={() => setTipo('outro')}  icon={MoreHorizontal}  label="Outro" />
        </div>

        {/* Form (scrollable) */}
        <div className="overflow-y-auto p-6 flex-1">
          {tipo === 'cota'   && <CotaForm   membros={membros} pending={pending} start={start} onClose={() => onOpenChange(false)} router={router} />}
          {tipo === 'seguro' && <SeguroForm membros={membros} pending={pending} start={start} onClose={() => onOpenChange(false)} router={router} defaultMembroId={defaultMembroId} />}
          {tipo === 'outro'  && <OutroForm  membros={membros} pending={pending} start={start} onClose={() => onOpenChange(false)} router={router} defaultMembroId={defaultMembroId} />}
        </div>
      </div>
    </div>
  )
}

function TipoTab({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-bold uppercase tracking-wider transition-colors ${
        active
          ? 'bg-[#E8B55B]/10 text-[#E8B55B] border-b-2 border-[#E8B55B]'
          : 'text-white/40 hover:text-white/70 border-b-2 border-transparent'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}

// ─── COTA FORM (multi-select + lote) ────────────────────────────
function CotaForm({ membros, pending, start, onClose, router }: any) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [mes, setMes] = useState(new Date().toISOString().slice(0, 7))
  const [valor, setValor] = useState('30')

  // Agrupa membros por turma
  const grupos = useMemo(() => {
    const g: Record<string, MembroOption[]> = {}
    for (const m of membros) {
      if (m.is_isento) continue
      g[m.turma] = g[m.turma] || []
      g[m.turma].push(m)
    }
    return g
  }, [membros])

  const turmas: Turma[] = ['gatinhos', 'suricatas', 'leoes', 'adultos', 'mulheres']

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll(turma: string) {
    setSelected(prev => {
      const next = new Set(prev)
      for (const m of grupos[turma] || []) next.add(m.id)
      return next
    })
  }

  function submit() {
    if (selected.size === 0) return toast.error('Selecciona pelo menos 1 membro.')
    if (!mes) return toast.error('Mês de referência obrigatório.')
    const v = parseFloat(valor)
    if (isNaN(v) || v <= 0) return toast.error('Valor inválido.')

    start(async () => {
      const fd = new FormData()
      Array.from(selected).forEach(id => fd.append('membro_ids[]', id))
      fd.append('mes_referencia', mes)
      fd.append('valor', valor)
      await registarPagamentosLote(fd)
      toast.success(`${selected.size} pagamento(s) registado(s)`)
      onClose()
      router.refresh()
    })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Mês de Referência</label>
          <input
            type="month"
            value={mes}
            onChange={e => setMes(e.target.value)}
            className="w-full px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl text-sm [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-[#E8B55B]"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Valor (€)</label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={e => setValor(e.target.value)}
            className="w-full px-3 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B55B]"
          />
        </div>
      </div>

      <div className="bg-black/20 rounded-xl border border-white/5 p-4 max-h-80 overflow-y-auto custom-scrollbar space-y-4">
        {turmas.map(t => {
          const lista = grupos[t] || []
          if (lista.length === 0) return null
          return (
            <div key={t}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#E8B55B]">{TURMA_LABELS[t]}</p>
                <button type="button" onClick={() => selectAll(t)} className="text-[10px] text-white/40 hover:text-[#E8B55B] uppercase tracking-wider">
                  Seleccionar todos
                </button>
              </div>
              <div className="space-y-1">
                {lista.map(m => (
                  <label key={m.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={selected.has(m.id)}
                      onChange={() => toggle(m.id)}
                      className="w-4 h-4 accent-[#E8B55B]"
                    />
                    <span className="flex-1 text-white/80">{m.nome}</span>
                  </label>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <p className="text-xs text-white/50">
          {selected.size > 0 ? (
            <>
              <span className="text-[#E8B55B] font-bold">{selected.size}</span> seleccionado(s) ·
              total <span className="text-[#E8B55B] font-bold">{(selected.size * Number(valor || 0)).toFixed(0)}€</span>
            </>
          ) : (
            'Sem membros seleccionados.'
          )}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} disabled={pending} className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5">
            Cancelar
          </button>
          <button type="button" onClick={submit} disabled={pending || selected.size === 0} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#E8B55B] hover:bg-[#C99C4A] disabled:opacity-50">
            {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Registar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── SEGURO FORM ────────────────────────────────────────────────
function SeguroForm({ membros, pending, start, onClose, router, defaultMembroId }: any) {
  const [membroId, setMembroId] = useState<string>(defaultMembroId ?? '')
  const [valor, setValor] = useState<32 | 45>(32)
  const [ano, setAno] = useState(new Date().getFullYear())
  const [metodo, setMetodo] = useState<'dinheiro' | 'mbway'>('mbway')

  const membroSel = useMemo(
    () => (membros as MembroOption[]).find(m => m.id === membroId) ?? null,
    [membros, membroId],
  )
  const vaiMudarCompeticao = valor === 45 && membroSel && !membroSel.is_competicao

  function submit() {
    if (!membroId) return toast.error('Selecciona um atleta.')
    start(async () => {
      const res = await registarSeguro({ membroId, valor, ano, metodo })
      if (res.error) toast.error(res.error)
      else {
        toast.success(`Seguro ${ano} registado (${valor}€)${vaiMudarCompeticao ? ' · marcado como competidor' : ''}`)
        onClose()
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Atleta</label>
        <select
          value={membroId}
          onChange={e => setMembroId(e.target.value)}
          className="w-full px-3 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B55B]"
        >
          <option value="">— Escolher —</option>
          {membros.map((m: MembroOption) => (
            <option key={m.id} value={m.id}>
              {m.nome}{m.is_competicao ? ' · competidor' : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-2">Tipo de seguro</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValor(32)}
            className={`p-4 rounded-xl border text-left transition-all ${
              valor === 32
                ? 'bg-[#E8B55B]/10 border-[#E8B55B] text-[#E8B55B]'
                : 'bg-[#1A1A1A] border-white/10 text-white/70 hover:border-white/30'
            }`}
          >
            <p className="text-xl font-bold">{SEGURO_VALORES.recreativo}€</p>
            <p className="text-[11px] uppercase tracking-wider mt-1 opacity-70">Recreativo</p>
          </button>
          <button
            type="button"
            onClick={() => setValor(45)}
            className={`p-4 rounded-xl border text-left transition-all ${
              valor === 45
                ? 'bg-[#E8B55B]/10 border-[#E8B55B] text-[#E8B55B]'
                : 'bg-[#1A1A1A] border-white/10 text-white/70 hover:border-white/30'
            }`}
          >
            <p className="text-xl font-bold">{SEGURO_VALORES.competicao}€</p>
            <p className="text-[11px] uppercase tracking-wider mt-1 opacity-70">Competidor</p>
          </button>
        </div>
      </div>

      {vaiMudarCompeticao && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <p className="text-amber-200/90">
            <strong>{membroSel?.nome}</strong> ainda não está marcado como competidor.
            Ao registar este seguro, ficará automaticamente com a tag de competição.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Ano</label>
          <input
            type="number"
            value={ano}
            onChange={e => setAno(parseInt(e.target.value, 10) || ano)}
            className="w-full px-3 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B55B]"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Método</label>
          <select
            value={metodo}
            onChange={e => setMetodo(e.target.value as 'dinheiro' | 'mbway')}
            className="w-full px-3 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B55B]"
          >
            <option value="mbway">MBWay</option>
            <option value="dinheiro">Dinheiro</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
        <button type="button" onClick={onClose} disabled={pending} className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5">
          Cancelar
        </button>
        <button type="button" onClick={submit} disabled={pending || !membroId} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#E8B55B] hover:bg-[#C99C4A] disabled:opacity-50">
          {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Registar Seguro
        </button>
      </div>
    </div>
  )
}

// ─── OUTRO FORM ─────────────────────────────────────────────────
function OutroForm({ membros, pending, start, onClose, router, defaultMembroId }: any) {
  const [membroId, setMembroId] = useState<string>(defaultMembroId ?? '')
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')

  function submit() {
    if (!membroId) return toast.error('Selecciona um membro.')
    const v = parseFloat(valor)
    if (isNaN(v) || v <= 0) return toast.error('Valor inválido.')

    start(async () => {
      const res = await registarPagamento({ membroId, tipo: 'outro', valor: v, descricao: descricao || undefined })
      if (res.error) toast.error(res.error)
      else {
        toast.success('Pagamento registado')
        onClose()
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Membro</label>
        <select
          value={membroId}
          onChange={e => setMembroId(e.target.value)}
          className="w-full px-3 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B55B]"
        >
          <option value="">— Escolher —</option>
          {membros.map((m: MembroOption) => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Valor (€)</label>
        <input
          type="number"
          step="0.01"
          value={valor}
          onChange={e => setValor(e.target.value)}
          className="w-full px-3 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B55B]"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">Descrição</label>
        <input
          type="text"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          placeholder="Ex: Pagamento de inscrição em torneio"
          className="w-full px-3 py-2.5 bg-[#1A1A1A] text-white border border-[#333333] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B55B]"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
        <button type="button" onClick={onClose} disabled={pending} className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5">
          Cancelar
        </button>
        <button type="button" onClick={submit} disabled={pending || !membroId} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#E8B55B] hover:bg-[#C99C4A] disabled:opacity-50">
          {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Registar
        </button>
      </div>
    </div>
  )
}
