// ─── PAGAMENTOS — CONSTANTES E TIPOS ───────────────────────────
// Fonte única para tudo o que descreve os pagamentos: tipos
// suportados, tom de cor (compat com Chip), valores fixos do
// seguro, e formatos legíveis. Usado pela página /dashboard/pagamentos
// e pela ficha do membro.

import { CreditCard, Shield, ShoppingBag, Calendar, MoreHorizontal, type LucideIcon } from 'lucide-react'

// ─── SEGUROS ──────────────────────────────────────────────────────
// Dois únicos valores possíveis. 45€ marca automaticamente o atleta
// como `is_competicao=true` (regra de negócio confirmada com o utilizador).
export const SEGURO_VALORES = { recreativo: 32, competicao: 45 } as const
export type SeguroTipo = keyof typeof SEGURO_VALORES

export function inferTipoSeguro(valor: number): SeguroTipo | null {
  if (valor === 32) return 'recreativo'
  if (valor === 45) return 'competicao'
  return null
}

// ─── TIPOS DE PAGAMENTO ───────────────────────────────────────────
export type PagamentoTipo = 'cota' | 'seguro' | 'loja' | 'evento' | 'outro'

export const PAGAMENTO_TIPOS: Record<PagamentoTipo, {
  label: string
  tone: 'gold' | 'blue' | 'purple' | 'green' | 'neutral'
  icon: LucideIcon
}> = {
  cota:   { label: 'Cota mensal',  tone: 'gold',    icon: CreditCard },
  seguro: { label: 'Seguro anual', tone: 'blue',    icon: Shield },
  loja:   { label: 'Loja',         tone: 'purple',  icon: ShoppingBag },
  evento: { label: 'Evento',       tone: 'green',   icon: Calendar },
  outro:  { label: 'Outro',        tone: 'neutral', icon: MoreHorizontal },
}

// ─── ROW TYPE ─────────────────────────────────────────────────────
export interface PagamentoRow {
  id: string
  membro_id: string
  tipo: PagamentoTipo
  mes_referencia: string | null
  valor: number
  descricao: string | null
  data_pagamento: string
  admin_id: string
  // joined (opcional, depende da query)
  membros?: {
    nome: string
    turma: string
    is_competicao: boolean
    email: string | null
    telefone: string | null
    cota: number | null
  } | null
}

// ─── HELPERS ──────────────────────────────────────────────────────
export const MES_LABEL_PT: Record<string, string> = {
  '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
  '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
  '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez',
}

/** Converte "2026-04" em "Abr 2026" para display. */
export function formatMesReferencia(s: string | null | undefined): string {
  if (!s) return '—'
  const [y, m] = s.split('-')
  return `${MES_LABEL_PT[m] ?? m} ${y}`
}

/** Devolve "YYYY-MM" do mês actual. */
export function mesActual(): string {
  return new Date().toISOString().slice(0, 7)
}
