import Link from "next/link";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata = {
  title: "Recuperar Password | Infante Boxing Club",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/login"
          className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          &larr; Voltar ao Login
        </Link>
      </div>

      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden p-8 space-y-8 z-10 card-gold-accent">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
