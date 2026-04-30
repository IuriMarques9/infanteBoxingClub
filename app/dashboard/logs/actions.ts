'use server'

import { createClient } from '@/lib/supabase/server'
import { toCSV } from '@/lib/csv'
import { getActivityLabel } from '@/lib/activity-log-labels'

// ─── ATIVIDADE POR DIA (D3) ────────────────────────────────────
// Retorna 30 pontos (último mês) com a contagem de logs por dia.
// Usado no sparkline acima da tabela.
export async function getActivityLast30Days(): Promise<{ date: string; count: number }[]> {
  const supabase = await createClient()
  const since = new Date()
  since.setDate(since.getDate() - 29)
  since.setHours(0, 0, 0, 0)

  const { data } = await (supabase
    .from('activity_log')
    .select('created_at')
    .gte('created_at', since.toISOString()) as any)

  // Inicializa 30 dias com 0 e preenche.
  const buckets: Record<string, number> = {}
  for (let i = 0; i < 30; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    buckets[d.toISOString().slice(0, 10)] = 0
  }
  for (const row of (data || [])) {
    const k = (row.created_at as string).slice(0, 10)
    if (k in buckets) buckets[k]++
  }
  return Object.entries(buckets).map(([date, count]) => ({ date, count }))
}

export interface LogsExportFilters {
  action?: string
  admin?: string
  entity?: string
  q?: string
  from?: string
  to?: string
}

// ─── EXPORTAR LOGS DE AUDITORIA EM CSV ─────────────────────────
// Aplica os mesmos filtros usados na página `/dashboard/logs` e
// devolve um CSV com até 5.000 entradas (limite seguro para evitar
// payloads enormes em audits longos).
export async function exportLogsCSV(filters: LogsExportFilters): Promise<string> {
  const supabase = await createClient()

  let query: any = (supabase.from('activity_log') as any)
    .select('created_at, action, entity_type, entity_id, description, profiles:admin_id(email, nome)')
    .order('created_at', { ascending: false })
    .limit(5000)

  if (filters.action) query = query.eq('action', filters.action)
  if (filters.admin) query = query.eq('admin_id', filters.admin)
  if (filters.entity) query = query.eq('entity_type', filters.entity)
  if (filters.q) query = query.eq('entity_id', filters.q)
  if (filters.from) query = query.gte('created_at', filters.from)
  if (filters.to) {
    // incluir o dia "to" inteiro adicionando 1 dia (mesma lógica da page)
    const toDate = new Date(filters.to)
    toDate.setDate(toDate.getDate() + 1)
    query = query.lt('created_at', toDate.toISOString().slice(0, 10))
  }

  const { data } = await query

  const rows = (data || []).map((log: any) => ({
    data_hora: new Date(log.created_at).toLocaleString('pt-PT'),
    admin: log.profiles?.nome || log.profiles?.email?.split('@')[0] || log.profiles?.email || 'Admin',
    acao_codigo: log.action,
    acao_label: getActivityLabel(log.action).label,
    entidade: log.entity_type || '',
    entidade_id: log.entity_id || '',
    descricao: log.description || '',
  }))

  return toCSV(rows, [
    { key: 'data_hora',    label: 'Data / Hora' },
    { key: 'admin',        label: 'Admin' },
    { key: 'acao_label',   label: 'Ação' },
    { key: 'acao_codigo',  label: 'Código' },
    { key: 'entidade',     label: 'Entidade' },
    { key: 'entidade_id',  label: 'ID' },
    { key: 'descricao',    label: 'Descrição' },
  ])
}
