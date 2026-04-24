'use client'

import Link, { useLinkStatus } from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode, ComponentProps } from 'react'

type LinkProps = ComponentProps<typeof Link>

export function PendingLink({
  children,
  className,
  spinnerClassName,
  ...props
}: LinkProps & { children: ReactNode; spinnerClassName?: string }) {
  return (
    <Link {...props} className={cn('relative inline-flex items-center gap-2', className)}>
      {children}
      <LinkSpinner className={spinnerClassName} />
    </Link>
  )
}

export function BackLink({
  href,
  className,
}: {
  href: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'relative inline-flex items-center justify-center text-white/50 hover:text-[#E8B55B] transition-colors',
        className,
      )}
    >
      <BackIcon />
    </Link>
  )
}

function BackIcon() {
  const { pending } = useLinkStatus()
  return pending ? (
    <Loader2 className="w-5 h-5 animate-spin text-[#E8B55B]" />
  ) : (
    <ArrowLeft className="w-5 h-5" />
  )
}

export function LinkSpinner({ className }: { className?: string }) {
  const { pending } = useLinkStatus()
  if (!pending) return null
  return <Loader2 className={cn('w-4 h-4 animate-spin text-[#E8B55B]', className)} />
}
