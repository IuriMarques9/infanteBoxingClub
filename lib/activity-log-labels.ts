// ─── MAPA DE LABELS DE ACTIVITY_LOG ────────────────────────────
// As strings na coluna `action` (ex: CRIAR_HORARIO) são código bruto.
// Este módulo converte-as numa apresentação humana com ícone e tom.
// A string original fica disponível em tooltip/aria para devs.

import {
  Activity,
  CalendarDays,
  CalendarPlus,
  ClipboardList,
  CreditCard,
  FileText,
  FileX,
  Pencil,
  Plus,
  Trash2,
  Upload,
  UserMinus,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'

export type ActivityTone = 'gold' | 'green' | 'red' | 'blue' | 'purple' | 'neutral'

export interface ActivityLabel {
  /** Texto humano curto (capitalizado, sem hashtag). */
  label: string
  /** Ícone Lucide que representa a ação. */
  icon: LucideIcon
  /** Tom de cor já compatível com `Chip` e `actionTone()` antiga. */
  tone: ActivityTone
}

const LABELS: Record<string, ActivityLabel> = {
  // Membros
  CRIAR_MEMBRO:    { label: 'Membro criado',    icon: UserPlus,  tone: 'gold' },
  EDITAR_MEMBRO:   { label: 'Membro editado',   icon: Pencil,    tone: 'blue' },
  ELIMINAR_MEMBRO: { label: 'Membro eliminado', icon: UserMinus, tone: 'red' },

  // Pagamentos
  REGISTAR_PAGAMENTO:       { label: 'Pagamento registado',     icon: CreditCard, tone: 'green' },
  REGISTAR_PAGAMENTOS_LOTE: { label: 'Pagamentos em lote',      icon: CreditCard, tone: 'green' },
  ELIMINAR_PAGAMENTO:       { label: 'Pagamento removido',      icon: Trash2,     tone: 'red' },

  // Horários
  CRIAR_HORARIO:    { label: 'Horário criado',    icon: CalendarPlus, tone: 'gold' },
  EDITAR_HORARIO:   { label: 'Horário editado',   icon: CalendarDays, tone: 'blue' },
  ELIMINAR_HORARIO: { label: 'Horário eliminado', icon: Trash2,       tone: 'red' },

  // Documentos
  UPLOAD_DOCUMENTO:    { label: 'Documento enviado',  icon: Upload,   tone: 'gold' },
  ELIMINAR_DOCUMENTO:  { label: 'Documento removido', icon: FileX,    tone: 'red' },

  // Ficha de cliente
  ATUALIZAR_FICHA: { label: 'Ficha atualizada', icon: ClipboardList, tone: 'blue' },

  // Eventos / Loja (tabs bloqueadas; mapeadas só por completude)
  CRIAR_EVENTO:    { label: 'Evento criado',    icon: CalendarPlus, tone: 'gold' },
  EDITAR_EVENTO:   { label: 'Evento editado',   icon: CalendarDays, tone: 'blue' },
  ELIMINAR_EVENTO: { label: 'Evento eliminado', icon: Trash2,       tone: 'red' },
  CRIAR_PRODUTO:    { label: 'Produto criado',    icon: Plus,    tone: 'gold' },
  EDITAR_PRODUTO:   { label: 'Produto editado',   icon: Pencil,  tone: 'blue' },
  ELIMINAR_PRODUTO: { label: 'Produto eliminado', icon: Trash2,  tone: 'red' },
}

const FALLBACK: ActivityLabel = {
  label: 'Atividade',
  icon: Activity,
  tone: 'neutral',
}

export function getActivityLabel(action: string | null | undefined): ActivityLabel {
  if (!action) return FALLBACK
  return LABELS[action] ?? {
    // Heurística: se não está no mapa, deriva tom pelo prefixo (compat com actionTone() antigo).
    label: action.replace(/_/g, ' ').toLowerCase().replace(/^./, c => c.toUpperCase()),
    icon: action.startsWith('ELIMINAR') ? Trash2 : action.startsWith('EDITAR') ? Pencil : FileText,
    tone:
      action.startsWith('ELIMINAR') ? 'red' :
      action.startsWith('EDITAR')   ? 'blue' :
      action.startsWith('CRIAR') || action.startsWith('REGISTAR') || action.startsWith('UPLOAD') ? 'gold' :
      'neutral',
  }
}

// Mapa simples para apresentar o `entity_type` em português. Usado nos
// dropdowns de filtro do histórico (em vez de mostrar "membro" / "pagamento"
// directamente da BD, mostramos "Membros" / "Pagamentos").
const ENTITY_LABELS: Record<string, string> = {
  membro:    'Membros',
  pagamento: 'Pagamentos',
  horario:   'Horários',
  documento: 'Documentos',
  ficha:     'Fichas',
  evento:    'Eventos',
  produto:   'Produtos',
  admin:     'Administradores',
}

export function getEntityLabel(entityType: string | null | undefined): string {
  if (!entityType) return 'Entidade'
  return ENTITY_LABELS[entityType] ?? entityType.charAt(0).toUpperCase() + entityType.slice(1)
}

// Permite navegação a partir de uma linha de log para o recurso afetado.
export function getEntityHref(entityType: string | null, entityId: string | null): string | null {
  if (!entityType) return null
  if (entityType === 'membro' && entityId) return `/dashboard/membros/${entityId}`
  if (entityType === 'horario') return '/dashboard/horarios'
  if (entityType === 'pagamento' && entityId) return `/dashboard/membros/${entityId}`
  if (entityType === 'documento' && entityId) return `/dashboard/membros/${entityId}`
  if (entityType === 'ficha' && entityId) return `/dashboard/membros/${entityId}`
  return null
}

// Timestamp relativo curto (PT). "há 3min", "ontem", "há 2 dias".
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diffMs = Date.now() - d.getTime()
  const sec = Math.floor(diffMs / 1000)
  if (sec < 60) return 'agora mesmo'
  const min = Math.floor(sec / 60)
  if (min < 60) return `há ${min}min`
  const hours = Math.floor(min / 60)
  if (hours < 24) return `há ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ontem'
  if (days < 30) return `há ${days} dias`
  const months = Math.floor(days / 30)
  if (months < 12) return `há ${months} ${months === 1 ? 'mês' : 'meses'}`
  return d.toLocaleDateString('pt-PT')
}
