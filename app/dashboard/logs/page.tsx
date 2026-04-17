import { createClient } from '@/lib/supabase/server'
import { History, User, Activity, Calendar } from 'lucide-react'

// ─── PÁGINA DE AUDITORIA GLOBAL ──────────────────────────────
// Permite ver todas as ações realizadas por todos os admins.
export const metadata = { title: 'Log de Atividades | Dashboard' }

export default async function ActivityLogPage() {
  const supabase = await createClient()

  const { data: logs } = await (supabase
    .from('activity_log')
    .select(`
      *,
      profiles:admin_id ( email )
    `)
    .order('created_at', { ascending: false })
    .limit(100) as any)

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
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/60 border border-white/10">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/40">
                      {log.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-white/20 italic">
                    Nenhuma atividade registada até ao momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold text-center">
        Sistema de Auditoria Infante Boxing CRM v1.0 · Acesso Restrito
      </p>
    </div>
  )
}
