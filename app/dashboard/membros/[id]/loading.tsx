import { Skeleton, SkeletonCard } from '@/components/dashboard/Skeleton'

export default function MembroProfileLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-5 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <SkeletonCard className="h-96" />
          <SkeletonCard className="h-64" />
          <SkeletonCard className="h-56" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard className="h-96" />
        </div>
      </div>
    </div>
  )
}
