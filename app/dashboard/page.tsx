export const metadata = {
  title: "Dashboard | Infante Boxing Club",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Total de Sócios Ativos</h3>
          <p className="text-3xl font-bold text-foreground">124</p>
          <span className="text-xs text-primary mt-2 inline-block">+12% este mês</span>
        </div>
        
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Treinos Hoje</h3>
          <p className="text-3xl font-bold text-foreground">5</p>
          <span className="text-xs text-muted-foreground mt-2 inline-block">16:00, 18:00, 19:30</span>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Pagamentos Pendentes</h3>
          <p className="text-3xl font-bold text-foreground">14</p>
          <span className="text-xs text-destructive mt-2 inline-block">Ação necessária</span>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Bem-vindo à área de administração</h3>
        <p className="text-muted-foreground">
          Por enquanto esta dashboard é apenas uma interface visual. Futuramente, quando conectares a base de dados (Ex: Supabase), estes números virão diretamente do servidor e as páginas ao lado permitirão a adição e edição de Sócios e Pagamentos.
        </p>
      </div>
    </div>
  );
}
