import { Skeleton } from "@/components/ui/skeleton"

export default function FormateursLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="rounded-lg border border-border">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border p-4 last:border-b-0">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="ml-auto h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}
