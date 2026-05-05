'use client'

import { useActionState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { login, type LoginState } from './actions'

const INITIAL_STATE: LoginState = {}

export default function LoginForm({ initialError }: { initialError?: string }) {
  const [state, formAction, pending] = useActionState(login, INITIAL_STATE)

  const errorKey = state.error ?? initialError
  const errorMessage =
    errorKey === 'Invalid Credentials'
      ? 'Email ou palavra-passe incorretos.'
      : errorKey === 'not_admin'
      ? 'Esta conta não tem permissões de administrador.'
      : errorKey
      ? 'Ocorreu um erro ao iniciar sessão.'
      : null

  return (
    <>
      {errorMessage && (
        <div className="bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errorMessage}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@infanteboxing.pt"
              defaultValue={state.email ?? ''}
              className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent transition-all placeholder:text-zinc-500"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Palavra-passe
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Esqueci-me da minha palavra-passe
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              defaultValue={state.password ?? ''}
              className="w-full px-4 py-3 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8B55B] focus:border-transparent transition-all placeholder:text-zinc-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_hsl(41_55%_57%/0.4)] disabled:opacity-70 disabled:cursor-wait"
        >
          {pending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              A entrar…
            </>
          ) : (
            'Iniciar Sessão'
          )}
        </button>
      </form>
    </>
  )
}
