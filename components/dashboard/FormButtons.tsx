'use client'

import { useFormStatus } from 'react-dom'
import { Loader2, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function SubmitPrimary({
  children,
  pendingLabel = 'A guardar…',
  className,
}: {
  children: ReactNode
  pendingLabel?: string
  className?: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full py-3 rounded-xl bg-[#E8B55B] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#C99C4A] shadow-[0_0_15px_rgba(232,181,91,0.3)] transition-all disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2",
        className,
      )}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  )
}

export function SubmitDelete({
  children,
  pendingLabel = 'A eliminar…',
}: {
  children: ReactNode
  pendingLabel?: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-all disabled:opacity-60 disabled:cursor-wait"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> {pendingLabel}
        </>
      ) : (
        <>
          <Trash2 className="w-4 h-4" /> {children}
        </>
      )}
    </button>
  )
}

export function SubmitPaymentCheck({ ariaLabel }: { ariaLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={ariaLabel}
      className="mt-1.5 px-2 py-0.5 rounded text-green-400 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all disabled:opacity-60 disabled:cursor-wait"
    >
      {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
    </button>
  )
}

export function SubmitPaymentDelete({ ariaLabel }: { ariaLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      aria-label={ariaLabel}
      disabled={pending}
      className={cn(
        "p-1 rounded transition-all disabled:cursor-wait",
        pending
          ? "text-red-400 opacity-100"
          : "text-green-400/40 hover:text-red-400 opacity-0 group-hover:opacity-100",
      )}
    >
      {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
    </button>
  )
}
