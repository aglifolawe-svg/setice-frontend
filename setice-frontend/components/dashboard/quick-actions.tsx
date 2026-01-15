"use client"

import { Plus, BookOpen, FolderKanban, Users, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickAction {
  label: string
  icon: typeof Plus
  onClick: () => void
}

interface QuickActionsProps {
  onCreateEspace: () => void
  onCreatePromotion: () => void
  onCreateFormateur: () => void
  onCreateEtudiant: () => void
}

export function QuickActions({
  onCreateEspace,
  onCreatePromotion,
  onCreateFormateur,
  onCreateEtudiant,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    { label: "Créer un espace pédagogique", icon: BookOpen, onClick: onCreateEspace },
    { label: "Créer une promotion", icon: FolderKanban, onClick: onCreatePromotion },
    { label: "Créer un formateur", icon: Users, onClick: onCreateFormateur },
    { label: "Créer un étudiant", icon: GraduationCap, onClick: onCreateEtudiant },
  ]

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium text-foreground">Actions rapides</h3>
      </div>
      <div className="divide-y divide-border">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-muted-foreground",
              "transition-colors duration-150 hover:bg-accent hover:text-foreground",
            )}
          >
            <Plus className="h-4 w-4" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
