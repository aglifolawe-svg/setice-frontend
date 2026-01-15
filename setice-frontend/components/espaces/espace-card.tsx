"use client"

import Link from "next/link"
import { Users, MoreHorizontal, Pencil, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { EspacePedagogique } from "@/types"

interface EspaceCardProps {
  espace: EspacePedagogique
  onAssignFormateur?: () => void
  onAddEtudiants?: () => void
  onDelete?: () => void
}

export function EspaceCard({ espace, onAssignFormateur, onAddEtudiants, onDelete }: EspaceCardProps) {
  return (
    <div className="group rounded-lg border border-border bg-card p-4 notion-card-hover">
      <div className="flex items-start justify-between">
        <Link href={`/espaces/${espace.id}`} className="flex-1">
          <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
            {espace.matiere.libelle}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center rounded bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
              {espace.promotion.code}
            </span>
            <span>{espace.annee}</span>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Prof. {espace.formateur.prenom} {espace.formateur.nom}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {espace.etudiants?.length ?? 0} étudiants
            </span>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/espaces/${espace.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Voir les détails
              </Link>
            </DropdownMenuItem>
            {onAssignFormateur && (
              <DropdownMenuItem onClick={onAssignFormateur}>
                <UserPlus className="mr-2 h-4 w-4" />
                Modifier le formateur
              </DropdownMenuItem>
            )}
            {onAddEtudiants && (
              <DropdownMenuItem onClick={onAddEtudiants}>
                <Users className="mr-2 h-4 w-4" />
                Inscrire des étudiants
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
