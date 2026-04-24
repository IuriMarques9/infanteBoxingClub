// ─── TIPOS DE TURMAS ─────────────────────────────────────────────
export type Turma = 'gatinhos' | 'suricatas' | 'leoes' | 'adultos' | 'mulheres'

export const TURMA_LABELS: Record<Turma, string> = {
  gatinhos: '🐱 Gatinhos',
  suricatas: '🦦 Suricatas',
  leoes: '🦁 Leões',
  adultos: '🥊 Adultos',
  mulheres: '👩 Mulheres',
}

// ─── ESTADOS DO MEMBRO ─────────────────────────────────────────
export type StatusMembro = 'isento' | 'pago' | 'nao_pago' | 'inativo'

export const STATUS_CONFIG: Record<StatusMembro, { label: string; color: string; bg: string; border: string }> = {
  isento:   { label: 'Isento',    color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/20' },
  pago:     { label: 'Pago',      color: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/20' },
  nao_pago: { label: 'Não Pago',  color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  inativo:  { label: 'Inativo',   color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/20' },
}

// ─── SEGURO (PAGAMENTO ANUAL) ──────────────────────────────────
export type SeguroPago = 'dinheiro' | 'mbway'

export const SEGURO_LABELS: Record<SeguroPago, string> = {
  dinheiro: '💵 Dinheiro',
  mbway: '📱 MBWay',
}

// Atalhos sugeridos para cota (datalist, NÃO enum — admin escreve qualquer valor)
export const COTAS_SUGERIDAS = [20, 25, 27.5, 30, 35]

// Estados alinhados com a view membros_status
// 'em_atraso' substitui semanticamente 'nao_pago' + 'inativo' simplificando o dashboard.
export type StatusMembroView = 'isento' | 'pago' | 'em_atraso'
