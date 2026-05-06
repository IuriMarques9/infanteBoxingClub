import { createClient } from "@/lib/supabase/server";
import { Users, CreditCard, TrendingUp, Calendar, Activity, ShieldCheck, UserCheck, UserX, ShieldAlert, ChevronRight, AlertTriangle, FileWarning, BarChart3 } from "lucide-react";
import { calcularEstado } from "./membros/actions";
import { type StatusMembro } from "./membros/constants";
import { anoAtual, membroInativo } from "@/lib/membros-estado";
import Link from "next/link";
import StatCard from "@/components/shared/StatCard";
import MonthlyRevenueChart from "@/components/dashboard/MonthlyRevenueChartLazy";
import { getActivityLabel, getEntityHref, formatRelativeTime } from "@/lib/activity-log-labels";
import { getRelatorioMensal } from "./pagamentos/actions";

export const metadata = {
  title: "Dashboard | Infante Boxing Club",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // 0. Nome do admin autenticado — para o greeting personalizado
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  const { data: adminProfile } = await (supabase
    .from('profiles')
    .select('nome, email')
    .eq('id', currentUser?.id ?? '')
    .maybeSingle() as any)
  const nomeAdmin = adminProfile?.nome || adminProfile?.email?.split('@')[0] || currentUser?.email?.split('@')[0] || 'Admin'

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

  // 2. Buscar últimos logs de atividade — JOIN com profiles para mostrar
  //    o nome (ou prefixo do email) do admin responsável por cada acção.
  const { data: logs } = await (supabase
    .from('activity_log')
    .select('*, profiles:admin_id ( email, nome )')
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

  // 8. Recebido no mês anterior — para calcular delta MoM (A2).
  const mesAnterior = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    .toISOString().slice(0, 7);
  let recebidoMesAnterior = 0;
  try {
    const { data: pagAnt } = await (supabase
      .from('pagamentos')
      .select('valor')
      .eq('mes_referencia', mesAnterior) as any);
    recebidoMesAnterior = (pagAnt || []).reduce((s: number, p: any) => s + Number(p.valor), 0);
  } catch {
    recebidoMesAnterior = 0;
  }
  // Delta percentual; null se mês anterior é zero (não dividir por zero).
  const deltaPct = recebidoMesAnterior > 0
    ? Math.round(((recebidoMes - recebidoMesAnterior) / recebidoMesAnterior) * 100)
    : null;
  const deltaAbs = recebidoMes - recebidoMesAnterior;

  // 9. Relatório mensal (12 meses do ano corrente) — alimenta o gráfico (A1).
  const relatorioMensal = await getRelatorioMensal(now.getFullYear());

  // 10. Alertas Urgentes (A3) — derivações em memória sobre membros já carregados.
  //   • inativosCriticos: 3+ meses sem pagar (mês atual, anterior e o anterior a esse).
  //   • inspeccoesEmFalta: descomentar quando houver query a documents (placeholder = 0).
  //   • seguros expiram este mês (futura impl). Por agora reuso segurosEmFalta.
  const mes2Atras = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    .toISOString().slice(0, 7);
  const inativosCriticos = membrosComStatus.filter((m: any) => {
    if (m.is_isento) return false;
    const mp: string[] = (m.pagamentos || []).map((p: any) => p.mes_referencia);
    return !mp.includes(mesAtual) && !mp.includes(mesAnterior) && !mp.includes(mes2Atras);
  });
  const algumAlertaUrgente = inativosCriticos.length > 0 || segurosEmFalta > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header Greeting */}
      <div className="flex justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-[#E8B55B] tracking-wider drop-shadow-[0_0_10px_rgba(232,181,91,0.3)]">Bem-vindo, {nomeAdmin}</h1>
        </div>
        {/* Última atividade real, derivada do log mais recente. Substitui o indicador "Online" estático. */}
        {logs && logs.length > 0 && (
          <div className="text-right hidden md:block">
             <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Última Atividade</p>
             <p className="text-xs text-white/70 font-medium flex items-center gap-2 justify-end mt-1">
               <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
               {formatRelativeTime(logs[0].created_at)}
             </p>
          </div>
        )}
      </div>

      {/* Grid de Métricas Reais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
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
          hint={
            deltaPct === null
              ? `de ${receitaPrevista}€`
              : `${deltaPct >= 0 ? '▲' : '▼'} ${Math.abs(deltaPct)}% vs mês anterior (${deltaAbs >= 0 ? '+' : ''}${deltaAbs}€)`
          }
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

      {/* Alertas Urgentes (A3) — só aparece se houver algum alerta ativo. */}
      {algumAlertaUrgente && (
        <div className="bg-gradient-to-br from-red-500/[0.06] to-amber-500/[0.04] border border-red-500/20 rounded-2xl p-5 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Alertas Urgentes
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Requer ação
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inativosCriticos.length > 0 && (
              <Link
                href="/dashboard/membros?estado=inativo"
                className="group flex items-start gap-3 p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-300 shrink-0">
                  <UserX className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-red-300 font-bold text-sm">
                    {inativosCriticos.length} membro{inativosCriticos.length !== 1 ? 's' : ''} 3+ meses sem pagar
                  </p>
                  <p className="text-white/50 text-xs mt-0.5 truncate">
                    {inativosCriticos.slice(0, 3).map((m: any) => m.nome).join(', ')}
                    {inativosCriticos.length > 3 && ` +${inativosCriticos.length - 3}`}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-red-300 mt-1 shrink-0" />
              </Link>
            )}
            {segurosEmFalta > 0 && (
              <Link
                href="/dashboard/membros?seguro=em_falta"
                className="group flex items-start gap-3 p-4 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                  <FileWarning className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-amber-300 font-bold text-sm">
                    {segurosEmFalta} seguro{segurosEmFalta !== 1 ? 's' : ''} por regularizar
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">
                    Ano {anoAtual()} sem comprovativo
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-amber-300 mt-1 shrink-0" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Gráfico de Receita Mensal (A1) — usa MonthlyRevenueChart já existente. */}
      <div className="bg-[#121212] rounded-2xl border border-white/5 p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#E8B55B] flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Receita Mensal · {now.getFullYear()}
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
            Total: {relatorioMensal.reduce((s: number, m: any) => s + m.total, 0)}€
          </span>
        </div>
        <MonthlyRevenueChart data={relatorioMensal} />
      </div>

      {/* Middle Row: Histórico e Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

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
                   {logs.map((log: any) => {
                     const labelInfo = getActivityLabel(log.action)
                     const href = getEntityHref(log.entity_type, log.entity_id)
                     const Icon = labelInfo.icon
                     const toneCls =
                       labelInfo.tone === 'gold'  ? 'text-[#E8B55B] bg-[#E8B55B]/10 border-[#E8B55B]/20' :
                       labelInfo.tone === 'green' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' :
                       labelInfo.tone === 'red'   ? 'text-red-300 bg-red-500/10 border-red-500/20' :
                       labelInfo.tone === 'blue'  ? 'text-sky-300 bg-sky-500/10 border-sky-500/20' :
                       'text-white/60 bg-white/5 border-white/10'
                     const inner = (
                       <>
                          <div className="flex items-center gap-4 min-w-0">
                             <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-all ${toneCls}`}>
                                <Icon className="w-4 h-4" />
                             </div>
                             <div className="min-w-0">
                                <p className="text-sm text-white/80 font-medium truncate">{log.description}</p>
                                <p className="text-[10px] text-white/40 font-medium mt-0.5 flex items-center gap-2 flex-wrap">
                                  <span className="font-bold uppercase tracking-wider text-white/30">{labelInfo.label}</span>
                                  <span className="w-0.5 h-0.5 rounded-full bg-white/20"></span>
                                  <span className="text-[#E8B55B]/70 font-bold">
                                    {log.profiles?.nome || log.profiles?.email?.split('@')[0] || 'Admin eliminado'}
                                  </span>
                                  <span className="w-0.5 h-0.5 rounded-full bg-white/20"></span>
                                  <span>{formatRelativeTime(log.created_at)}</span>
                                </p>
                             </div>
                          </div>
                          {href && (
                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#E8B55B] transition-colors shrink-0" />
                          )}
                       </>
                     )
                     const baseCls = `p-4 transition-colors flex items-center justify-between gap-3 group ${href ? 'hover:bg-white/[0.03] cursor-pointer' : ''}`
                     return href ? (
                       <Link key={log.id} href={href} title={`#${log.action}`} className={baseCls}>{inner}</Link>
                     ) : (
                       <div key={log.id} title={`#${log.action}`} className={baseCls}>{inner}</div>
                     )
                   })}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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
