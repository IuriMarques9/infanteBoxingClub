import { Skeleton, SkeletonCard } from '@/components/dashboard/Skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-3 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-3"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonCard className="lg:col-span-2 h-80" />
        <SkeletonCard className="h-80" />
      </div>
    </div>
  )
}
