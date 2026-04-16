import Link from "next/link";
import { Lock, AlertCircle } from "lucide-react";
import { login } from "./actions";

export const metadata = {
  title: "Login | Infante Boxing Club",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative z-10">
      {/* Glow Effect decorativo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      {/* Back to Site Link */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
          &larr; Voltar ao Site
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden p-8 space-y-8 z-10 card-gold-accent">
        
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-foreground uppercase tracking-wider text-glow">
            Área Reservada
          </h1>
          <p className="text-muted-foreground text-sm">
            Inicie sessão para aceder ao sistema.
          </p>
        </div>

        {searchParams?.error && (
          <div className="bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {searchParams.error === "Invalid Credentials" ? "Email ou palavra-passe incorretos." : "Ocorreu um erro ao iniciar sessão."}
          </div>
        )}

        <form action={login} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
              <input
                id="email"
                name="email"
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
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-3 px-4 rounded-lg transition-all flex items-center justify-center hover:shadow-[0_0_20px_hsl(41_55%_57%/0.4)]"
          >
            Iniciar Sessão
          </button>
        </form>
        
        <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Acesso restrito. Se precisa de acesso contacte a administração.
            </p>
        </div>
      </div>
    </div>
  );
}
