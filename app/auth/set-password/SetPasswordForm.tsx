"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

type SessionState = "loading" | "ready" | "invalid" | "success";

export default function SetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();
  const [sessionState, setSessionState] = useState<SessionState>("loading");
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // O link do invite vem com tokens no fragmento (#) da URL.
  // Lemos os tokens, criamos a sessão, e só depois aceitamos a nova password.
  useEffect(() => {
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const errorDescription = params.get("error_description");

    if (errorDescription) {
      setSessionError(decodeURIComponent(errorDescription));
      setSessionState("invalid");
      return;
    }

    if (!accessToken || !refreshToken) {
      setSessionError("Link inválido ou expirado. Pede um novo convite ao administrador.");
      setSessionState("invalid");
      return;
    }

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (error) {
          setSessionError(error.message);
          setSessionState("invalid");
        } else {
          setSessionState("ready");
          window.history.replaceState(null, "", window.location.pathname);
        }
      });
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (password.length < 8) {
      setFormError("A password tem de ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmar) {
      setFormError("As passwords não coincidem.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setSessionState("success");
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  if (sessionState === "loading") {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#E8B55B] mx-auto" />
        <p className="text-white/50 text-sm mt-3">A validar link…</p>
      </div>
    );
  }

  if (sessionState === "invalid") {
    return (
      <div className="text-center space-y-3">
        <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <h1 className="text-xl font-headline font-bold text-destructive uppercase tracking-wider">
          Link inválido
        </h1>
        <p className="text-muted-foreground text-sm">
          {sessionError ?? "Não foi possível validar o convite."}
        </p>
      </div>
    );
  }

  if (sessionState === "success") {
    return (
      <div className="text-center py-4">
        <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-xl font-headline font-bold text-emerald-300 uppercase tracking-wider">
          Password definida
        </h1>
        <p className="text-white/50 text-sm mt-2">A redirecionar para o dashboard…</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-headline font-bold text-foreground uppercase tracking-wider text-glow">
          Definir Password
        </h1>
        <p className="text-muted-foreground text-sm">
          Escolhe uma password para ativar a tua conta.
        </p>
      </div>

      {formError && (
        <div className="bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Nova password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              placeholder="Mínimo 8 caracteres"
              className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent transition-all placeholder:text-zinc-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmar" className="text-sm font-medium text-foreground">
              Confirmar password
            </label>
            <input
              id="confirmar"
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              minLength={8}
              required
              placeholder="Repete a password"
              className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent transition-all placeholder:text-zinc-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-black bg-[#E8B55B] hover:bg-[#C99C4A] disabled:opacity-50 transition-colors"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Ativar conta
        </button>
      </form>
    </>
  );
}
