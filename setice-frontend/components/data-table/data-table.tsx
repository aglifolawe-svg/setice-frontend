"use client"

import type React from "react"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  emptyTitle?: string
  emptyDescription?: string
  getRowKey: (item: T) => string
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  searchPlaceholder = "Rechercher...",
  searchValue,
  onSearchChange,
  emptyTitle = "Aucune donnée",
  emptyDescription = "Aucun élément à afficher",
  getRowKey,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {onSearchChange && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={searchPlaceholder} className="pl-9" disabled />
          </div>
        )}
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

  return (
    <div className="space-y-3">
      {onSearchChange && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <div className="rounded-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-border bg-muted/50 px-4 py-3">
          {columns.map((col, i) => (
            <div
              key={i}
              className={`text-xs font-medium uppercase tracking-wider text-muted-foreground ${col.className || "flex-1"}`}
            >
              {col.header}
            </div>
          ))}
        </div>

        {/* Rows */}
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
            <p className="mt-1 text-xs text-muted-foreground">{emptyDescription}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {data.map((item) => (
              <div
                key={getRowKey(item)}
                className="flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors"
              >
                {columns.map((col, i) => (
                  <div key={i} className={`text-sm ${col.className || "flex-1"}`}>
                    {typeof col.accessor === "function" ? col.accessor(item) : String(item[col.accessor] ?? "")}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
