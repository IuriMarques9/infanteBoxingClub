import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-white/[0.06]',
        className,
      )}
    />
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
        className,
      )}
    >
      <Skeleton className="h-4 w-32 mb-5" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  )
}

export function PageLoader({ label = 'A carregar…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-white/40 text-sm">
      <span className="relative inline-flex h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-[#E8B55B] animate-ping opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E8B55B]" />
      </span>
      {label}
    </div>
  )
}
