"use client"

import { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useEspaces, usePromotions } from "@/hooks/use-data"
import { EspaceCard } from "@/components/espaces/espace-card"
import { EspaceFilters } from "@/components/espaces/espace-filters"
import { EmptyState } from "@/components/espaces/empty-state"
import { CreateEspaceModal } from "@/components/modals/create-espace-modal"
import { AssignFormateurModal } from "@/components/modals/assign-formateur-modal"
import { AddEtudiantsModal } from "@/components/modals/add-etudiants-modal"
import type { EspacePedagogique } from "@/types"

export default function EspacesPage() {
  const { espaces, isLoading } = useEspaces()
  const { promotions } = usePromotions()

  // Filters state
  const [searchQuery, setSearchQuery] = useState("")
  const [promotionFilter, setPromotionFilter] = useState("all")
  const [anneeFilter, setAnneeFilter] = useState("all")

  // Modal states
  const [showCreateEspace, setShowCreateEspace] = useState(false)
  const [showAssignFormateur, setShowAssignFormateur] = useState(false)
  const [showAddEtudiants, setShowAddEtudiants] = useState(false)
  const [selectedEspace, setSelectedEspace] = useState<EspacePedagogique | null>(null)

  // Get unique years from espaces
  const annees = useMemo(() => {
    const uniqueAnnees = [...new Set(espaces.map((e) => e.annee))]
    return uniqueAnnees.sort().reverse()
  }, [espaces])

  // Filter espaces
  const filteredEspaces = useMemo(() => {
    return espaces.filter((espace) => {
      const matchesSearch = espace.matiere.libelle.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPromotion = promotionFilter === "all" || espace.promotion.id === promotionFilter
      const matchesAnnee = anneeFilter === "all" || espace.annee === anneeFilter
      return matchesSearch && matchesPromotion && matchesAnnee
    })
  }, [espaces, searchQuery, promotionFilter, anneeFilter])

  const handleAssignFormateur = (espace: EspacePedagogique) => {
    setSelectedEspace(espace)
    setShowAssignFormateur(true)
  }

  const handleAddEtudiants = (espace: EspacePedagogique) => {
    setSelectedEspace(espace)
    setShowAddEtudiants(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Espaces Pédagogiques</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérez vos espaces d'enseignement</p>
        </div>
        <Button onClick={() => setShowCreateEspace(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Créer
        </Button>
      </div>

      {/* Filters */}
      <EspaceFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        promotionFilter={promotionFilter}
        onPromotionChange={setPromotionFilter}
        anneeFilter={anneeFilter}
        onAnneeChange={setAnneeFilter}
        promotions={promotions}
        annees={annees}
      />

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4">
              <Skeleton className="mb-2 h-6 w-48" />
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      ) : filteredEspaces.length === 0 ? (
        <EmptyState
          title={espaces.length === 0 ? "Aucun espace pédagogique" : "Aucun résultat"}
          description={
            espaces.length === 0
              ? "Créez votre premier espace pour commencer"
              : "Modifiez vos filtres pour voir plus de résultats"
          }
          actionLabel="Créer un espace"
          onAction={espaces.length === 0 ? () => setShowCreateEspace(true) : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filteredEspaces.map((espace) => (
            <EspaceCard
              key={espace.id}
              espace={espace}
              onAssignFormateur={() => handleAssignFormateur(espace)}
              onAddEtudiants={() => handleAddEtudiants(espace)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateEspaceModal open={showCreateEspace} onOpenChange={setShowCreateEspace} />
      <AssignFormateurModal open={showAssignFormateur} onOpenChange={setShowAssignFormateur} espace={selectedEspace} />
      <AddEtudiantsModal open={showAddEtudiants} onOpenChange={setShowAddEtudiants} espace={selectedEspace} />
    </div>
  )
}
