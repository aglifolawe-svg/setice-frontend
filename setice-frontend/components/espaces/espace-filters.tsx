"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Promotion } from "@/types"

interface EspaceFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  promotionFilter: string
  onPromotionChange: (value: string) => void
  anneeFilter: string
  onAnneeChange: (value: string) => void
  promotions: Promotion[]
  annees: string[]
}

export function EspaceFilters({
  searchQuery,
  onSearchChange,
  promotionFilter,
  onPromotionChange,
  anneeFilter,
  onAnneeChange,
  promotions,
  annees,
}: EspaceFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher une matière..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Promotion Filter */}
      <Select value={promotionFilter} onValueChange={onPromotionChange}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Promotion" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les promotions</SelectItem>
          {promotions.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Année Filter */}
      <Select value={anneeFilter} onValueChange={onAnneeChange}>
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Année" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les années</SelectItem>
          {annees.map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
