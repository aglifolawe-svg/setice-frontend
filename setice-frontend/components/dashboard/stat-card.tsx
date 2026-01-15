import type { LucideIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  isLoading?: boolean
}

export function StatCard({ label, value, icon: Icon, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-5 notion-card-hover">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 notion-card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-semibold text-foreground">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-light">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  )
}
