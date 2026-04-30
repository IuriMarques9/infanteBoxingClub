"use client";

import { useState } from "react";
import { KeyRound, AlertCircle, Loader2, MailCheck } from "lucide-react";
import { pedirRecuperacaoPassword } from "./actions";

export default function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const res = await pedirRecuperacaoPassword(formData);

    setSubmitting(false);

    if (res.error) {
      setError(res.error);
      return;
    }
    setSubmittedMessage(res.message);
  }

  if (submittedMessage) {
    return (
      <div className="text-center space-y-3">
        <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
          <MailCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-xl font-headline font-bold text-emerald-300 uppercase tracking-wider">
          Pedido recebido
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {submittedMessage}
        </p>
        <p className="text-white/40 text-xs italic mt-4">
          Verifica também a pasta de spam.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-headline font-bold text-foreground uppercase tracking-wider text-glow">
          Recuperar Password
        </h1>
        <p className="text-muted-foreground text-sm">
          Indica o teu email — vamos enviar-te um link para definires uma nova
          password.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            placeholder="admin@infanteboxing.pt"
            className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent transition-all placeholder:text-zinc-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-black bg-[#E8B55B] hover:bg-[#C99C4A] disabled:opacity-50 transition-colors"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Enviar link de recuperação
        </button>
      </form>
    </>
  );
}
