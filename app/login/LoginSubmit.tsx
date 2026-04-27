'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

// Botão de submit com estado de loading. Tem de viver dentro do
// `<form action={login}>` para que `useFormStatus` apanhe o pending.
export default function LoginSubmit() {
  const { pending } = useFormStatus()
  return (
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
  )
}
