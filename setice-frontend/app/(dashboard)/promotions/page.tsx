"use client"

import { useState, useMemo } from "react"
import { Plus, Calendar, Users, Pencil, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useEtudiants } from "@/hooks/use-data"
import { CreatePromotionModal } from "@/components/modals/create-promotion-modal"
import type { Promotion } from "@/types"
import { usePromotions } from "@/hooks/usePromotions"
import { toast } from "sonner"

export default function PromotionsPage() {
  const { promotions, isLoading, deletePromotion } = usePromotions()
  const { etudiants } = useEtudiants()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)

  // Compter les étudiants par promotion
  const etudiantsCountByPromotion = useMemo(() => {
    const counts: Record<string, number> = {}
    etudiants.forEach((e) => {
      if (e.promotion?.id) {
        counts[e.promotion.id] = (counts[e.promotion.id] || 0) + 1
      }
    })
    return counts
  }, [etudiants])

  // Filtrer les promotions selon la recherche
  const filteredPromotions = useMemo(() => {
    if (!searchQuery) return promotions
    const query = searchQuery.toLowerCase()
    return promotions.filter(
      (p) =>
        p.code.toLowerCase().includes(query) ||
        p.libelle.toLowerCase().includes(query) ||
        p.annee.includes(query)
    )
  }, [promotions, searchQuery])

  // ✅ Fonction de suppression
  const handleDelete = async (promotion: Promotion) => {
    const etudiantsCount = etudiantsCountByPromotion[promotion.id] || 0
    
    if (etudiantsCount > 0) {
      toast.error(`Impossible de supprimer : ${etudiantsCount} étudiant(s) dans cette promotion`)
      return
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer la promotion ${promotion.code} ?`)) {
      return
    }

    const result = await deletePromotion(promotion.id)
    
    if (result.success) {
      toast.success("Promotion supprimée avec succès")
    } else {
      toast.error(result.error || "Erreur lors de la suppression")
    }
  }

  // ✅ Fonction de modification
  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setShowCreateModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Promotions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérez les promotions d'étudiants</p>
        </div>
        <Button onClick={() => {
          setEditingPromotion(null)
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
          placeholder="Rechercher une promotion..."
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
      ) : filteredPromotions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium text-foreground">Aucune promotion</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {promotions.length === 0
              ? "Créez votre première promotion pour commencer"
              : "Modifiez vos filtres pour voir plus de résultats"}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-border bg-muted/50 px-4 py-3">
            <div className="w-36 text-xs font-medium uppercase tracking-wider text-muted-foreground">Code</div>
            <div className="flex-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Libellé</div>
            <div className="w-32 text-xs font-medium uppercase tracking-wider text-muted-foreground">Année</div>
            <div className="w-28 text-xs font-medium uppercase tracking-wider text-muted-foreground">Étudiants</div>
            <div className="w-24 text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {filteredPromotions.map((p: Promotion) => (
              <div key={p.id} className="flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors">
                <div className="w-36">
                  <span className="inline-flex items-center rounded bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                    {p.code}
                  </span>
                </div>
                <div className="flex-1 font-medium text-foreground">{p.libelle}</div>
                <div className="w-32 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {p.annee}
                </div>
                <div className="w-28 flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {etudiantsCountByPromotion[p.id] || 0}
                </div>
                <div className="w-24 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                    onClick={() => handleEdit(p)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(p)}
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
      <CreatePromotionModal 
        open={showCreateModal} 
        onOpenChange={(open) => {
          setShowCreateModal(open)
          if (!open) setEditingPromotion(null)
        }}
        editingPromotion={editingPromotion}
      />
    </div>
  )
}