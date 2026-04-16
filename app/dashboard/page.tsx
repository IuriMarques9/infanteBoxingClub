import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard | Infante Boxing Club",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // Buscar contagens
  const { count: modalidadesCount } = await supabase.from("modalidades").select("*", { count: "exact", head: true });
  const { count: eventosCount } = await supabase.from("eventos").select("*", { count: "exact", head: true });
  const { count: lojaCount } = await supabase.from("store_products").select("*", { count: "exact", head: true });

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-1 text-foreground">Bem-vindo à área de administração</h3>
          <p className="text-muted-foreground text-sm">
            Gere o conteúdo da página do clube. Os teus dados estão sincronizados em tempo real com o Supabase.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm transition-transform hover:scale-[1.02] cursor-default border-t-4 border-t-primary">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Total de Modalidades</h3>
          <p className="text-4xl font-bold text-foreground text-glow">{modalidadesCount || 0}</p>
        </div>
        
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm transition-transform hover:scale-[1.02] cursor-default border-t-4 border-t-primary">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Eventos Agendados</h3>
          <p className="text-4xl font-bold text-foreground text-glow">{eventosCount || 0}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm transition-transform hover:scale-[1.02] cursor-default border-t-4 border-t-primary">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Items na Loja</h3>
          <p className="text-4xl font-bold text-foreground text-glow">{lojaCount || 0}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
         <div className="p-6 bg-card rounded-xl border border-border">
             <h4 className="font-semibold text-lg text-primary mb-3">Gestão Rápida</h4>
             <ul className="space-y-2 text-sm text-muted-foreground">
                 <li>Utiliza o menu à esquerda para adicionares novas modalidades ou editares os horários.</li>
                 <li>Na secção de Eventos poderás adicionar galas, interclubes ou comunicados cruciais para a equipa.</li>
                 <li>A loja encontra-se sincronizada com a Landing Page, ativa e desativa items para controlar o stock.</li>
             </ul>
         </div>
      </div>

    </div>
  );
}
