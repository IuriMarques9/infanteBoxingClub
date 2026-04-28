import SetPasswordForm from "./SetPasswordForm";

export const metadata = {
  title: "Definir Password | Infante Boxing Club",
  robots: { index: false, follow: false },
};

export default function SetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden p-8 space-y-8 z-10 card-gold-accent">
        <SetPasswordForm />
      </div>
    </div>
  );
}
