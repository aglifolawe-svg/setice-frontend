import Link from "next/link"
import { BookOpen, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { EspacePedagogique } from "@/types"

interface RecentEspacesProps {
  espaces: EspacePedagogique[]
  isLoading?: boolean
}

export function RecentEspaces({ espaces, isLoading }: RecentEspacesProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4">
              <Skeleton className="mb-2 h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (espaces.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-medium text-foreground">Espaces récents</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Aucun espace pédagogique</p>
          <p className="mt-1 text-xs text-muted-foreground">Créez votre premier espace pour commencer</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium text-foreground">Espaces récents</h3>
        <Link href="/espaces" className="text-xs font-medium text-primary hover:text-primary-hover transition-colors">
          Voir tous
        </Link>
      </div>
      <div className="divide-y divide-border">
        {espaces.map((espace) => (
          <Link
            key={espace.id}
            href={`/espaces/${espace.id}`}
            className="block p-4 transition-colors duration-150 hover:bg-accent"
          >
            <h4 className="font-medium text-foreground">{espace.matiere.libelle}</h4>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center rounded bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                {espace.promotion.code}
              </span>
              <span>{espace.annee}</span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {espace.etudiants?.length ?? 0}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
