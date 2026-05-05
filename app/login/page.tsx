import Link from "next/link";
import { Lock } from "lucide-react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login | Infante Boxing Club",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: initialError } = await searchParams;
  return (
    <div className="min-h-screen bg-background flex flex-col p-4 relative z-10">
      {/* Glow Effect decorativo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      {/* Back to Site Link */}
      <div className="z-20 mb-4">
        <Link
          href="/"
          className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          &larr; Voltar ao Site
        </Link>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center">
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

          <LoginForm initialError={initialError} />

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Acesso restrito. Se precisa de acesso contacte a administração.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
