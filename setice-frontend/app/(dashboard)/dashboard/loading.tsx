import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-5 w-48" />
        <Skeleton className="mt-1 h-4 w-36" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-1 p-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-1 h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
