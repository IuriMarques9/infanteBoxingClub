import { createClient } from "@/lib/supabase/server";
import { Users, CreditCard, TrendingUp, Calendar, Activity, ShieldCheck, UserCheck, UserX, ShieldAlert } from "lucide-react";
import { calcularEstado } from "./membros/actions";
import { type StatusMembro } from "./membros/constants";
import { anoAtual, membroInativo } from "@/lib/membros-estado";
import Link from "next/link";
import StatCard from "@/components/shared/StatCard";

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
  const isentos = membrosComStatus.filter(m => m.status === 'isento').length;

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

  // 4. Métricas de tesouraria — pagamentos do mês atual
  const now = new Date();
  const mesAtual = now.toISOString().slice(0, 7); // YYYY-MM

  let recebidoMes = 0;
  let pagamentosCount = 0;
  try {
    const { data: pagMes } = await (supabase
      .from('pagamentos')
      .select('valor')
      .eq('mes_referencia', mesAtual) as any);
    recebidoMes = (pagMes || []).reduce((s: number, p: any) => s + Number(p.valor), 0);
    pagamentosCount = (pagMes || []).length;
  } catch {
    recebidoMes = 0;
    pagamentosCount = 0;
  }

  // 5. Receita prevista (soma das cotas dos não-isentos)
  let receitaPrevista = 0;
  try {
    const { data: cotas } = await (supabase
      .from('membros')
      .select('cota, is_isento') as any);
    receitaPrevista = (cotas || [])
      .filter((m: any) => !m.is_isento)
      .reduce((s: number, m: any) => s + Number(m.cota || 30), 0);
  } catch {
    receitaPrevista = 0;
  }

  // 6. Inativos — derivado em memória a partir dos pagamentos do mês atual + anterior.
  const inativos = membrosComStatus.filter((m: any) =>
    membroInativo(m, (m.pagamentos || []).map((p: any) => p.mes_referencia))
  ).length;

  // 7. Seguros em falta — membros sem seguro_ano_pago === ano corrente.
  let segurosEmFalta = 0;
  try {
    const ano = anoAtual();
    const { count } = await (supabase
      .from('membros')
      .select('id', { count: 'exact', head: true })
      .or(`seguro_ano_pago.is.null,seguro_ano_pago.neq.${ano}`) as any);
    segurosEmFalta = count || 0;
  } catch {
    segurosEmFalta = 0;
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          label="Total Membros"
          value={totalMembros}
          tone="gold"
          href="/dashboard/membros"
        />
        <StatCard
          icon={UserCheck}
          label="Pagos este Mês"
          value={ativos}
          tone="green"
          href="/dashboard/membros?status=pago"
        />
        <StatCard
          icon={UserX}
          label="Inativos"
          value={inativos}
          tone="red"
          href="/dashboard/membros?estado=inativo"
          hint="2 meses s/ pagar"
        />
        <StatCard
          icon={TrendingUp}
          label="Recebido este Mês"
          value={`${recebidoMes}€`}
          tone="gold"
          hint={`de ${receitaPrevista}€`}
        />
        <StatCard
          icon={ShieldAlert}
          label="Seguros em Falta"
          value={segurosEmFalta}
          tone="blue"
          href="/dashboard/membros?seguro=em_falta"
          hint={`ano ${anoAtual()}`}
        />
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
               <p className="text-[10px] text-white/40">{pagamentosCount} Pagamentos processados este mês</p>
            </div>
         </div>
      </div>

    </div>
  );
}
