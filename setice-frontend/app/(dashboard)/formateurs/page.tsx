"use client"

import { useState, useMemo } from "react"
import { Plus, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFormateurs } from "@/hooks/use-data"
import { DataTable } from "@/components/data-table/data-table"
import { CreateFormateurModal } from "@/components/modals/create-formateur-modal"
import type { Formateur } from "@/types"

export default function FormateursPage() {
  const { formateurs, isLoading } = useFormateurs()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)

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

  const columns = [
    {
      header: "Nom",
      accessor: (f: Formateur) => (
        <span className="font-medium text-foreground">
          {f.user.prenom} {f.user.nom}
        </span>
      ),
    },
    {
      header: "Email",
      accessor: (f: Formateur) => (
        <span className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          {f.user.email}
        </span>
      ),
    },
    {
      header: "Spécialité",
      accessor: (f: Formateur) => <span className="text-muted-foreground">{f.specialite || "-"}</span>,
    },
    {
      header: "Statut",
      accessor: (f: Formateur) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            f.actif ? "bg-success-light text-success" : "bg-muted text-muted-foreground"
          }`}
        >
          {f.actif ? "Actif" : "Inactif"}
        </span>
      ),
      className: "w-24",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Formateurs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérez les comptes formateurs</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Créer
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={filteredFormateurs}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Rechercher un formateur..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        emptyTitle="Aucun formateur"
        emptyDescription="Créez votre premier formateur pour commencer"
        getRowKey={(f) => f.id}
      />

      {/* Modal */}
      <CreateFormateurModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  )
}
