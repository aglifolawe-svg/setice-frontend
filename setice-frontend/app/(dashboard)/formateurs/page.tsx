"use client"

import { useState, useMemo } from "react"
import { Plus, Mail, Pencil, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useFormateurs } from "@/hooks/useFormateurs"
import { CreateFormateurModal } from "@/components/modals/create-formateur-modal"
import type { Formateur } from "@/types"
import { toast } from "sonner"

export default function FormateursPage() {
  const { formateurs, isLoading, deleteFormateur } = useFormateurs()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingFormateur, setEditingFormateur] = useState<Formateur | null>(null)

  const filteredFormateurs = useMemo(() => {
    if (!searchQuery) return formateurs
    const query = searchQuery.toLowerCase()
    return formateurs.filter(
      (f) =>
        f.user.nom.toLowerCase().includes(query) ||
        f.user.prenom.toLowerCase().includes(query) ||
        f.user.email.toLowerCase().includes(query) ||
        f.specialite?.toLowerCase().includes(query),
    )
  }, [formateurs, searchQuery])

  // ✅ Fonction de suppression
  const handleDelete = async (formateur: Formateur) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${formateur.user.prenom} ${formateur.user.nom} ?`)) {
      return
    }

    const result = await deleteFormateur(formateur.id)
    
    if (result.success) {
      toast.success("Formateur supprimé avec succès")
    } else {
      toast.error(result.error || "Erreur lors de la suppression")
    }
  }

  // ✅ Fonction de modification
  const handleEdit = (formateur: Formateur) => {
    setEditingFormateur(formateur)
    setShowCreateModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Formateurs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérez les comptes formateurs</p>
        </div>
        <Button onClick={() => {
          setEditingFormateur(null)
          setShowCreateModal(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Créer
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un formateur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="rounded-lg border border-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 border-b border-border p-4 last:border-b-0">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="ml-auto h-5 w-24" />
            </div>
          ))}
        </div>
      ) : filteredFormateurs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium text-foreground">Aucun formateur</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formateurs.length === 0
              ? "Créez votre premier formateur pour commencer"
              : "Modifiez vos filtres pour voir plus de résultats"}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Nom</div>
            <div className="flex-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</div>
            <div className="w-40 text-xs font-medium uppercase tracking-wider text-muted-foreground">Spécialité</div>
            <div className="w-24 text-xs font-medium uppercase tracking-wider text-muted-foreground">Statut</div>
            <div className="w-24 text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {filteredFormateurs.map((f: Formateur) => (
              <div key={f.id} className="flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors">
                <div className="flex-1 font-medium text-foreground">
                  {f.user.prenom} {f.user.nom}
                </div>
                <div className="flex-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {f.user.email}
                </div>
                <div className="w-40 text-sm text-muted-foreground">{f.specialite || "-"}</div>
                <div className="w-24">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      f.actif ? "bg-success-light text-success" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {f.actif ? "Actif" : "Inactif"}
                  </span>
                </div>
                <div className="w-24 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                    onClick={() => handleEdit(f)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(f)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <CreateFormateurModal 
        open={showCreateModal} 
        onOpenChange={(open) => {
          setShowCreateModal(open)
          if (!open) setEditingFormateur(null)
        }}
        editingFormateur={editingFormateur}
      />
    </div>
  )
}