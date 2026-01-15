"use client"

import { useState, use } from "react"
import Link from "next/link"
import { ArrowLeft, Users, BookOpen, UserPlus, GraduationCap, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useEspaces } from "@/hooks/use-data"
import { AssignFormateurModal } from "@/components/modals/assign-formateur-modal"
import { AddEtudiantsModal } from "@/components/modals/add-etudiants-modal"

interface EspaceDetailPageProps {
  params: Promise<{ id: string }>
}

export default function EspaceDetailPage({ params }: EspaceDetailPageProps) {
  const { id } = use(params)
  const { espaces, isLoading} = useEspaces()
  const espace = espaces.find((e: { id: { toString: () => string } }) => e.id.toString() === id)

  console.log("Espace sélectionné :", espace)
console.log("Étudiants :", espace?.etudiants)

  const [showAssignFormateur, setShowAssignFormateur] = useState(false)
  const [showAddEtudiants, setShowAddEtudiants] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (!espace) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-medium text-foreground">Espace non trouvé</h2>
        <p className="mt-1 text-sm text-muted-foreground">Cet espace pédagogique n'existe pas</p>
        <Button asChild className="mt-4">
          <Link href="/espaces">Retour aux espaces</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/espaces"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux espaces
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{espace.matiere.libelle}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center rounded bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
              {espace.promotion.code}
            </span>
            
            <span className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              {espace.matiere.credits} crédits
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAssignFormateur(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Modifier formateur
          </Button>
          <Button onClick={() => setShowAddEtudiants(true)}>
            <Users className="mr-2 h-4 w-4" />
            Inscrire étudiants
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Formateur */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">Formateur</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {espace.formateur.prenom} {espace.formateur.nom}
              </p>
              <p className="text-sm text-muted-foreground">{espace.formateur.specialite || espace.formateur.email}</p>
            </div>
          </div>
        </div>

        {/* Promotion */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">Promotion</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{espace.promotion.code}</p>
              <p className="text-sm text-muted-foreground">{espace.promotion.libelle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Étudiants */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-medium text-foreground">Étudiants inscrits ({espace.etudiants?.length ?? 0})</h3>
        </div>
        {espace.etudiants && espace.etudiants.length > 0 ? (
          <div className="divide-y divide-border">
            {espace.etudiants.map((etudiant) => (
              <div key={etudiant.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium text-foreground">
                    {etudiant.user.prenom} {etudiant.user.nom}
                  </p>
                  <p className="text-sm text-muted-foreground">{etudiant.user.email}</p>
                </div>
                <span className="text-xs text-muted-foreground">{etudiant.matricule}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <GraduationCap className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Aucun étudiant inscrit</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 bg-transparent"
              onClick={() => setShowAddEtudiants(true)}
            >
              Inscrire des étudiants
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AssignFormateurModal open={showAssignFormateur} onOpenChange={setShowAssignFormateur} espace={espace} />
      <AddEtudiantsModal open={showAddEtudiants} onOpenChange={setShowAddEtudiants} espace={espace} />
    </div>
  )
}
