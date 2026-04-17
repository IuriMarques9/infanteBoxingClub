import { createClient } from "@/lib/supabase/server";
import { Users, CreditCard, TrendingUp, Calendar, Activity, ShieldCheck, UserX, UserCheck } from "lucide-react";
import { calcularEstado } from "./membros/actions";
import { type StatusMembro } from "./membros/constants";
import Link from "next/link";

export const metadata = {
  title: "Dashboard | Infante Boxing Club",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Buscar membros e seus pagamentos para calcular estados reais
  const { data: membros } = await (supabase
    .from('membros')
    .select('*, pagamentos(mes_referencia)') as any);

  const membrosComStatus = await Promise.all((membros || []).map(async (m: any) => ({
    ...m,
    status: await calcularEstado(m) as StatusMembro,
  })));

  const totalMembros = membrosComStatus.length;
  const ativos = membrosComStatus.filter(m => m.status === 'pago').length;
  const inativos = membrosComStatus.filter(m => m.status === 'inativo').length;
  const isentos = membrosComStatus.filter(m => m.status === 'isento').length;
  const naoPagos = membrosComStatus.filter(m => m.status === 'nao_pago').length;

  // 2. Buscar últimos logs de atividade
  const { data: logs } = await (supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5) as any);

  // 3. Buscar próximos eventos (Data >= Hoje)
  const today = new Date().toISOString();
  const { data: proximosEventos } = await (supabase
    .from('eventos')
    .select('*')
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(3) as any);

  // 4. Estatística rápida (ex: Receita estimada baseada em 30€ por ativo)
  const receitaEstimada = (ativos + naoPagos) * 30;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Greeting */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-white/40 text-lg font-medium tracking-wide">Bem-vindo,</h2>
          <h1 className="text-3xl font-headline font-bold text-[#E8B55B] tracking-wider mt-1 drop-shadow-[0_0_10px_rgba(232,181,91,0.3)]">Admin IBC</h1>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Estado do Sistema</p>
           <p className="text-xs text-green-400 font-medium flex items-center gap-2 justify-end mt-1">
             <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online & Sincronizado
           </p>
        </div>
      </div>

      {/* Grid de Métricas Reais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Link href="/dashboard/membros" className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-[#E8B55B]/20 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8B55B]/5 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/2" />
          <div className="flex justify-between items-start mb-4">
            <Users className="w-5 h-5 text-[#E8B55B]" />
            <span className="text-[10px] bg-[#E8B55B]/10 text-[#E8B55B] px-2 py-0.5 rounded font-bold">TOTAL</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1 tracking-tight">{totalMembros}</p>
          <p className="text-xs text-white/40 uppercase tracking-wider font-bold">Membros Registados</p>
        </Link>
        
        <Link href="/dashboard/membros?status=pago" className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-green-400/20 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/5 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/2" />
          <div className="flex justify-between items-start mb-4">
            <UserCheck className="w-5 h-5 text-green-400" />
            <span className="text-[10px] bg-green-400/10 text-green-400 px-2 py-0.5 rounded font-bold">ATIVOS</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1 tracking-tight">{ativos}</p>
          <p className="text-xs text-white/40 uppercase tracking-wider font-bold">Pagamento em dia</p>
        </Link>

        <Link href="/dashboard/membros?status=inativo" className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-red-400/20 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-400/5 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/2" />
          <div className="flex justify-between items-start mb-4">
            <UserX className="w-5 h-5 text-red-400" />
            <span className="text-[10px] bg-red-400/10 text-red-400 px-2 py-0.5 rounded font-bold">INATIVOS</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1 tracking-tight">{inativos}</p>
          <p className="text-xs text-white/40 uppercase tracking-wider font-bold">Dívidas pendentes</p>
        </Link>

        <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8B55B]/5 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/2" />
          <div className="flex justify-between items-start mb-4">
            <TrendingUp className="w-5 h-5 text-[#E8B55B]" />
            <span className="text-[10px] bg-[#E8B55B]/10 text-[#E8B55B] px-2 py-0.5 rounded font-bold">ESTIMATIVA</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1 tracking-tight">{receitaEstimada}€</p>
          <p className="text-xs text-white/40 uppercase tracking-wider font-bold">Receita Mensal Prevista</p>
        </div>
      </div>
      
      {/* Middle Row: Histórico e Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Historial de Ações Reais */}
         <div className="lg:col-span-2 bg-[#121212] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
               <h3 className="text-sm font-bold uppercase tracking-widest text-[#E8B55B] flex items-center gap-2">
                 <Activity className="w-4 h-4" /> Atividade Recente
               </h3>
               <Link href="/dashboard/logs" className="text-[10px] font-bold uppercase text-white/30 hover:text-white transition-colors tracking-widest">Ver Todos</Link>
            </div>
            
            <div className="p-0">
               {logs && logs.length > 0 ? (
                 <div className="divide-y divide-white/5">
                   {logs.map((log: any) => (
                     <div key={log.id} className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#E8B55B]/50 font-bold group-hover:bg-[#E8B55B]/10 group-hover:text-[#E8B55B] transition-all">
                              {log.action.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm text-white/80 font-medium">{log.description}</p>
                              <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider mt-0.5">
                                {new Date(log.created_at).toLocaleDateString('pt-PT')} às {new Date(log.created_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                           </div>
                        </div>
                        <div className="text-[10px] font-bold text-white/20 uppercase group-hover:text-[#E8B55B]/40 transition-colors">
                           #{log.action}
                        </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="p-12 text-center text-white/20 italic">
                   Nenhuma atividade registada.
                 </div>
               )}
            </div>
         </div>

         {/* Próximos Eventos Reais */}
         <div className="bg-[#121212] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
               <h3 className="text-sm font-bold uppercase tracking-widest text-[#E8B55B] flex items-center gap-2">
                 <Calendar className="w-4 h-4" /> Agenda do Clube
               </h3>
            </div>
            
            <div className="p-6 space-y-6">
               {proximosEventos && proximosEventos.length > 0 ? (
                 proximosEventos.map((ev: any) => (
                   <div key={ev.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center justify-center w-12 h-14 rounded-xl border border-[#E8B55B]/20 bg-[#E8B55B]/5 group-hover:bg-[#E8B55B] group-hover:text-black transition-all shadow-inner">
                         <span className="text-[10px] font-black uppercase leading-none opacity-60">
                           {new Date(ev.date).toLocaleDateString('pt-PT', { month: 'short' }).replace('.', '')}
                         </span>
                         <span className="text-xl font-black leading-none mt-1">
                           {new Date(ev.date).getDate()}
                         </span>
                      </div>
                      <div className="flex-1">
                         <h4 className="text-sm font-bold text-white group-hover:text-[#E8B55B] transition-colors">{ev.title}</h4>
                         <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1 flex items-center gap-1">
                           <Calendar className="w-3 h-3" /> {ev.location || 'IBC'}
                         </p>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-10">
                    <p className="text-white/20 text-xs italic">Sem eventos agendados.</p>
                    <Link href="/dashboard/eventos" className="inline-block mt-4 text-[10px] font-bold text-[#E8B55B] uppercase tracking-widest border border-[#E8B55B]/20 px-4 py-2 rounded-lg hover:bg-[#E8B55B]/10 transition-all">Criar Evento</Link>
                 </div>
               )}
            </div>

            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 text-center mt-auto">
               <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                 Infante Boxing CRM v1.0
               </p>
            </div>
         </div>
      </div>
      
      {/* Footer Info Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#E8B55B]/5 p-4 rounded-xl border border-[#E8B55B]/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#E8B55B]/20 flex items-center justify-center">
               <ShieldCheck className="w-5 h-5 text-[#E8B55B]" />
            </div>
            <div>
               <p className="text-xs font-bold text-[#E8B55B] uppercase tracking-widest">Segurança</p>
               <p className="text-[10px] text-white/40">Políticas RLS e Storage Ativos</p>
            </div>
         </div>
         <div className="bg-blue-400/5 p-4 rounded-xl border border-blue-400/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center">
               <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
               <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Isentos</p>
               <p className="text-[10px] text-white/40">{isentos} Membros com isenção ativa</p>
            </div>
         </div>
         <div className="bg-green-400/5 p-4 rounded-xl border border-green-400/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
               <CreditCard className="w-5 h-5 text-green-400" />
            </div>
            <div>
               <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Tesouraria</p>
               <p className="text-[10px] text-white/40">Pagamentos processados este mês</p>
            </div>
         </div>
      </div>

    </div>
  );
}