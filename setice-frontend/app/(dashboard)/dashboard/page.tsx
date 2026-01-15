"use client"

import { useState } from "react"
import { BookOpen, Users, GraduationCap } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useDashboardStats } from "@/hooks/use-data"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentEspaces } from "@/components/dashboard/recent-espaces"
import { CreateFormateurModal } from "@/components/modals/create-formateur-modal"
import { CreatePromotionModal } from "@/components/modals/create-promotion-modal"
import { CreateEtudiantModal } from "@/components/modals/create-etudiant-modal"
import { CreateEspaceModal } from "@/components/modals/create-espace-modal"

export default function DashboardPage() {
  const { user } = useAuth()
  const { stats, recentEspaces, isLoading } = useDashboardStats()

  // Modal states
  const [showCreateFormateur, setShowCreateFormateur] = useState(false)
  const [showCreatePromotion, setShowCreatePromotion] = useState(false)
  const [showCreateEtudiant, setShowCreateEtudiant] = useState(false)
  const [showCreateEspace, setShowCreateEspace] = useState(false)

  const roleLabel =
    user?.role === "DIRECTEUR_ETUDES" ? "Directeur des Études" : user?.role === "FORMATEUR" ? "Formateur" : "Étudiant"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Bonjour, {user?.prenom} {user?.nom}
        </p>
        <p className="text-sm text-muted-foreground">{roleLabel}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Espaces" value={stats.espacesCount} icon={BookOpen} isLoading={isLoading} />
        <StatCard label="Formateurs" value={stats.formateursCount} icon={Users} isLoading={isLoading} />
        <StatCard label="Étudiants" value={stats.etudiantsCount} icon={GraduationCap} isLoading={isLoading} />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <QuickActions
          onCreateEspace={() => setShowCreateEspace(true)}
          onCreatePromotion={() => setShowCreatePromotion(true)}
          onCreateFormateur={() => setShowCreateFormateur(true)}
          onCreateEtudiant={() => setShowCreateEtudiant(true)}
        />

        {/* Recent Espaces */}
        <RecentEspaces espaces={recentEspaces} isLoading={isLoading} />
      </div>

      {/* Modals */}
      <CreateFormateurModal open={showCreateFormateur} onOpenChange={setShowCreateFormateur} />
      <CreatePromotionModal open={showCreatePromotion} onOpenChange={setShowCreatePromotion} />
      <CreateEtudiantModal open={showCreateEtudiant} onOpenChange={setShowCreateEtudiant} />
      <CreateEspaceModal open={showCreateEspace} onOpenChange={setShowCreateEspace} />
    </div>
  )
}
