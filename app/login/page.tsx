import Link from "next/link";
import { Lock } from "lucide-react";

export const metadata = {
  title: "Login | Infante Boxing Club",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Back to Site Link */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          &larr; Voltar ao Site
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden p-8 space-y-8">
        
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-foreground uppercase tracking-wider">
            Painel Gestão
          </h1>
          <p className="text-muted-foreground text-sm">
            Inicie sessão para gerir o Infante Boxing Club.
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
              <input
                id="email"
                type="email"
                placeholder="admin@infanteboxing.pt"
                className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">Palavra-passe</label>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <Link href="/dashboard" className="w-full inline-block">
            <button
              type="button"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              Iniciar Sessão
            </button>
          </Link>
        </form>
        
        <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Acesso restrito apenas a administradores. <br/>A base de dados será conectada em breve.
            </p>
        </div>
      </div>
    </div>
  );
}
