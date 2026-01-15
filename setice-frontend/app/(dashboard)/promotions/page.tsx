"use client"

import { useState, useMemo } from "react"
import { Plus, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEtudiants } from "@/hooks/use-data"
import { DataTable } from "@/components/data-table/data-table"
import { CreatePromotionModal } from "@/components/modals/create-promotion-modal"
import type { Promotion } from "@/types"
import { usePromotions } from "@/hooks/usePromotions"

export default function PromotionsPage() {
  const { promotions, isLoading, refetch } = usePromotions() // <-- ajout du refetch
  const { etudiants } = useEtudiants()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Fonction pour gérer la réussite de la création
  const handleCreateSuccess = () => {
    setShowCreateModal(false) // ferme le modal
    refetch()                 // recharge la liste des promotions
  }

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

  // Colonnes de la table
  const columns = [
    {
      header: "Code",
      accessor: (p: Promotion) => (
        <span className="inline-flex items-center rounded bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
          {p.code}
        </span>
      ),
      className: "w-36",
    },
    {
      header: "Libellé",
      accessor: (p: Promotion) => <span className="font-medium text-foreground">{p.libelle}</span>,
    },
    {
      header: "Année",
      accessor: (p: Promotion) => (
        <span className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {p.annee}
        </span>
      ),
      className: "w-32",
    },
    {
      header: "Étudiants",
      accessor: (p: Promotion) => (
        <span className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {etudiantsCountByPromotion[p.id] || 0}
        </span>
      ),
      className: "w-28",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Promotions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérez les promotions d'étudiants</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Créer
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={filteredPromotions}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Rechercher une promotion..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        emptyTitle="Aucune promotion"
        emptyDescription="Créez votre première promotion pour commencer"
        getRowKey={(p) => p.id}
      />

      {/* Modal */}
      <CreatePromotionModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleCreateSuccess} // <-- mise à jour automatique après création
      />
    </div>
  )
}
