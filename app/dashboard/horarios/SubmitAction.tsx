'use client'

import { useFormStatus } from 'react-dom'
import { Loader2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState, type ReactNode } from 'react'

export function DeleteButton({ ariaLabel = 'Eliminar', size = 'sm' }: { ariaLabel?: string; size?: 'sm' | 'md' }) {
  const { pending } = useFormStatus()
  const iconCls = size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3'
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "text-white/40 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-wait"
      )}
      aria-label={ariaLabel}
    >
      {pending ? <Loader2 className={cn(iconCls, "animate-spin")} /> : <Trash2 className={iconCls} />}
    </button>
  )
}

export function PrimarySubmit({ children, className }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full py-3 rounded-xl bg-[#E8B55B] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#C99C4A] transition-all disabled:opacity-70 disabled:cursor-wait inline-flex items-center justify-center gap-2",
        className
      )}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? 'A guardar…' : children}
    </button>
  )
}

export function AddSubmit({ ariaLabel }: { ariaLabel: string }) {
  const { pending } = useFormStatus()
  const btnRef = useRef<HTMLButtonElement>(null)
  const [hasDay, setHasDay] = useState(false)

  // Observa as checkboxes "dias_semana" do form pai e desactiva o submit
  // até pelo menos um dia ser escolhido (C5).
  useEffect(() => {
    const form = btnRef.current?.closest('form')
    if (!form) return
    const update = () => {
      setHasDay(!!form.querySelector('input[name="dias_semana"]:checked'))
    }
    update()
    form.addEventListener('change', update)
    return () => form.removeEventListener('change', update)
  }, [])

  const disabled = pending || !hasDay
  return (
    <button
      ref={btnRef}
      type="submit"
      disabled={disabled}
      title={!hasDay ? 'Escolhe pelo menos um dia da semana' : undefined}
      aria-label={ariaLabel}
      className="ml-auto flex items-center justify-center w-8 h-8 rounded-md bg-[#E8B55B]/10 text-[#E8B55B] border border-[#E8B55B]/20 hover:bg-[#E8B55B]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#E8B55B]/10"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-lg leading-none">+</span>}
    </button>
  )
}
