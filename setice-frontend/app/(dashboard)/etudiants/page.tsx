"use client"

import { Suspense, useState, useMemo } from "react"
import { Plus, Mail, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { usePromotions } from "@/hooks/use-data"
import { CreateEtudiantModal } from "@/components/modals/create-etudiant-modal"
import type { Etudiant } from "@/types"
import { useEtudiants } from "@/hooks/useEtudiants"

function EtudiantsContent() {
  const { etudiants, isLoading } = useEtudiants()
  const { promotions } = usePromotions()
  const [searchQuery, setSearchQuery] = useState("")
  const [promotionFilter, setPromotionFilter] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)

  // ✅ Filtrage avec accès à e.user
  const filteredEtudiants = useMemo(() => {
    return etudiants.filter((e) => {
      const matchesSearch =
        !searchQuery ||
        e.user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.matricule.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesPromotion = promotionFilter === "all" || e.promotion?.id === promotionFilter

      return matchesSearch && matchesPromotion
    })
  }, [etudiants, searchQuery, promotionFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Étudiants</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérez les comptes étudiants</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Créer
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un étudiant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={promotionFilter} onValueChange={setPromotionFilter}>
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
      ) : filteredEtudiants.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium text-foreground">Aucun étudiant</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {etudiants.length === 0
              ? "Créez votre premier étudiant pour commencer"
              : "Modifiez vos filtres pour voir plus de résultats"}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Nom</div>
            <div className="flex-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</div>
            <div className="w-28 text-xs font-medium uppercase tracking-wider text-muted-foreground">Matricule</div>
            <div className="w-32 text-xs font-medium uppercase tracking-wider text-muted-foreground">Promotion</div>
            <div className="w-24 text-xs font-medium uppercase tracking-wider text-muted-foreground">Statut</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {filteredEtudiants.map((e: Etudiant) => (
              <div key={e.id} className="flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors">
                <div className="flex-1 font-medium text-foreground">
                  {e.user.prenom} {e.user.nom}
                </div>
                <div className="flex-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {e.user.email}
                </div>
                <div className="w-28 font-mono text-sm text-muted-foreground">{e.matricule}</div>
                <div className="w-32">
                  {e.promotion ? (
                    <span className="inline-flex items-center rounded bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                      {e.promotion.code}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
                <div className="w-24">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      e.actif ? "bg-success-light text-success" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {e.actif ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <CreateEtudiantModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  )
}

export default function EtudiantsPage() {
  return (
    <Suspense fallback={null}>
      <EtudiantsContent />
    </Suspense>
  )
}
