import { createClient } from '@/lib/supabase/server'
import { User, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import Chip from '@/components/shared/Chip'
import LogFilters from '@/components/dashboard/LogFilters'
import Link from 'next/link'

// ─── PÁGINA DE AUDITORIA GLOBAL ──────────────────────────────
// Permite ver todas as ações realizadas por todos os admins.
export const metadata = { title: 'Log de Atividades | Dashboard' }

const PAGE_SIZE = 50

const actionTone = (a: string): 'gold' | 'blue' | 'red' | 'green' | 'neutral' => {
  if (a.startsWith('CRIAR') || a.startsWith('REGISTAR') || a.startsWith('UPLOAD')) return 'gold'
  if (a.startsWith('EDITAR')) return 'blue'
  if (a.startsWith('ELIMINAR')) return 'red'
  return 'neutral'
}

type SearchParams = {
  action?: string
  admin?: string
  from?: string
  to?: string
  entity?: string
  page?: string
}

export default async function ActivityLogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const supabase = await createClient()
  const sp = await searchParams

  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1)
  const fromIdx = (page - 1) * PAGE_SIZE
  const toIdx = fromIdx + PAGE_SIZE - 1

  // 1. Distinct values to populate the filters (first 500 rows is a practical sample)
  const { data: distinct } = await (supabase
    .from('activity_log')
    .select('action, entity_type, admin_id, profiles:admin_id(email)')
    .limit(500) as any)

  const availableActions = Array.from(
    new Set((distinct || []).map((r: any) => r.action).filter(Boolean))
  ).sort() as string[]

  const availableEntities = Array.from(
    new Set((distinct || []).map((r: any) => r.entity_type).filter(Boolean))
  ).sort() as string[]

  const adminMap = new Map<string, string>()
  ;(distinct || []).forEach((r: any) => {
    if (r.admin_id) {
      adminMap.set(r.admin_id, r.profiles?.email?.split('@')[0] || r.admin_id.slice(0, 8))
    }
  })
  const availableAdmins = Array.from(adminMap.entries()).map(([id, label]) => ({ id, label }))

  // 2. Build the filtered query
  let query = supabase
    .from('activity_log')
    .select(`*, profiles:admin_id ( email )`)
    .order('created_at', { ascending: false })

  let countQuery = supabase
    .from('activity_log')
    .select('id', { count: 'exact', head: true })

  if (sp.action) {
    query = query.eq('action', sp.action)
    countQuery = countQuery.eq('action', sp.action)
  }
  if (sp.admin) {
    query = query.eq('admin_id', sp.admin)
    countQuery = countQuery.eq('admin_id', sp.admin)
  }
  if (sp.entity) {
    query = query.eq('entity_type', sp.entity)
    countQuery = countQuery.eq('entity_type', sp.entity)
  }
  if (sp.from) {
    query = query.gte('created_at', sp.from)
    countQuery = countQuery.gte('created_at', sp.from)
  }
  if (sp.to) {
    // include the entire "to" day by adding 1 day
    const toDate = new Date(sp.to)
    toDate.setDate(toDate.getDate() + 1)
    const toIso = toDate.toISOString().slice(0, 10)
    query = query.lt('created_at', toIso)
    countQuery = countQuery.lt('created_at', toIso)
  }

  const { data: logs } = await (query.range(fromIdx, toIdx) as any)
  const { count: total } = await (countQuery as any)

  const totalCount = total || 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  // Helper to build pagination URLs preserving filters
  const buildPageHref = (p: number) => {
    const params = new URLSearchParams()
    if (sp.action) params.set('action', sp.action)
    if (sp.admin) params.set('admin', sp.admin)
    if (sp.entity) params.set('entity', sp.entity)
    if (sp.from) params.set('from', sp.from)
    if (sp.to) params.set('to', sp.to)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `/dashboard/logs?${qs}` : '/dashboard/logs'
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-headline font-bold text-[#E8B55B] tracking-wider">
          Histórico do Sistema
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Monitoriza todas as alterações efetuadas por administradores na plataforma.
        </p>
      </div>

      {/* Filtros */}
      <LogFilters
        availableActions={availableActions}
        availableAdmins={availableAdmins}
        availableEntities={availableEntities}
      />

      <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Data/Hora</th>
                <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Admin</th>
                <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Ação</th>
                <th className="text-left px-6 py-4 text-white/50 text-xs uppercase tracking-wider font-medium">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs && logs.length > 0 ? (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-white/70">
                         <Calendar className="w-3.5 h-3.5 text-[#E8B55B]/50" />
                         {new Date(log.created_at).toLocaleString('pt-PT')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-[#E8B55B]">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="text-white/80 font-medium">
                          {log.profiles?.email?.split('@')[0] || 'Admin'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Chip tone={actionTone(log.action)} size="sm">
                        {log.action}
                      </Chip>
                    </td>
                    <td className="px-6 py-4 text-white/40">
                      {log.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-white/20 italic">
                    Nenhuma atividade registada para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalCount > PAGE_SIZE && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.02]">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              Página {page} de {totalPages} · {totalCount} entradas
            </p>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={buildPageHref(page - 1)}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-lg text-xs font-bold text-white/70 hover:text-[#E8B55B] hover:border-[#E8B55B]/30 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-lg text-xs font-bold text-white/20 cursor-not-allowed">
                  <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                </span>
              )}
              {page < totalPages ? (
                <Link
                  href={buildPageHref(page + 1)}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-lg text-xs font-bold text-white/70 hover:text-[#E8B55B] hover:border-[#E8B55B]/30 transition-colors"
                >
                  Próxima <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-lg text-xs font-bold text-white/20 cursor-not-allowed">
                  Próxima <ChevronRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold text-center">
        Sistema de Auditoria Infante Boxing CRM v1.0 · Acesso Restrito
      </p>
    </div>
  )
}
