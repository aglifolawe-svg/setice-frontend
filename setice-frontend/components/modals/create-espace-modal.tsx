"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle, Plus } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useEspaces, usePromotions, useFormateurs } from "@/hooks/use-data"
import { CreateMatiereModal } from "./create-matiere-modal"
import { useMatieres } from "@/hooks/useMatieres"

interface CreateEspaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateEspaceModal({ open, onOpenChange }: CreateEspaceModalProps) {
  const { mutate } = useEspaces()
  const { promotions, isLoading: loadingPromotions } = usePromotions()
  const { formateurs, isLoading: loadingFormateurs } = useFormateurs()
  const { matieres, isLoading: loadingMatieres } = useMatieres()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showCreateMatiere, setShowCreateMatiere] = useState(false)

  const [formData, setFormData] = useState({
    promotionId: "",
    matiereId: "",
    formateurId: "",
    annee: "",
  })

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.promotionId) {
      newErrors.promotionId = "Veuillez sélectionner une promotion"
    }
    if (!formData.matiereId) {
      newErrors.matiereId = "Veuillez sélectionner une matière"
    }
    if (!formData.formateurId) {
      newErrors.formateurId = "Veuillez sélectionner un formateur"
    }
    if (!formData.annee || !/^\d{4}-\d{4}$/.test(formData.annee)) {
      newErrors.annee = "Format: 2024-2025"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrors({})

    const result = await api.createEspace(formData)

    if (result.success) {
      toast.success("Espace pédagogique créé avec succès !")
      mutate()
      onOpenChange(false)
      setFormData({ promotionId: "", matiereId: "", formateurId: "", annee: "" })
    } else {
      toast.error(result.error || "Erreur lors de la création")
    }

    setLoading(false)
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un espace pédagogique</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Promotion */}
            <div className="space-y-2">
              <Label htmlFor="promotionId">
                Promotion <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.promotionId} onValueChange={(value) => handleChange("promotionId", value)}>
                <SelectTrigger className={errors.promotionId ? "border-destructive" : ""}>
                  <SelectValue placeholder={loadingPromotions ? "Chargement..." : "Sélectionner une promotion"} />
                </SelectTrigger>
                <SelectContent>
                  {promotions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.code} - {p.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.promotionId && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.promotionId}
                </p>
              )}
            </div>

            {/* Matière */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="matiereId">
                  Matière <span className="text-destructive">*</span>
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary hover:text-primary-hover"
                  onClick={() => setShowCreateMatiere(true)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Nouvelle matière
                </Button>
              </div>
              <Select value={formData.matiereId} onValueChange={(value) => handleChange("matiereId", value)}>
                <SelectTrigger className={errors.matiereId ? "border-destructive" : ""}>
                  <SelectValue placeholder={loadingMatieres ? "Chargement..." : "Sélectionner une matière"} />
                </SelectTrigger>
                <SelectContent>
                  {matieres.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.code} - {m.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.matiereId && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.matiereId}
                </p>
              )}
            </div>

            {/* Formateur */}
            <div className="space-y-2">
              <Label htmlFor="formateurId">
                Formateur <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.formateurId} onValueChange={(value) => handleChange("formateurId", value)}>
                <SelectTrigger className={errors.formateurId ? "border-destructive" : ""}>
                  <SelectValue placeholder={loadingFormateurs ? "Chargement..." : "Sélectionner un formateur"} />
                </SelectTrigger>
                <SelectContent>
                  {formateurs.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.user.prenom} {f.user.nom} {f.specialite && `(${f.specialite})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.formateurId && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.formateurId}
                </p>
              )}
            </div>

            {/* Année */}
            <div className="space-y-2">
              <Label htmlFor="annee">
                Année académique <span className="text-destructive">*</span>
              </Label>
              <Input
                id="annee"
                value={formData.annee}
                onChange={(e) => handleChange("annee", e.target.value)}
                placeholder="2024-2025"
                className={errors.annee ? "border-destructive" : ""}
              />
              {errors.annee && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.annee}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal pour créer une matière */}
      <CreateMatiereModal open={showCreateMatiere} onOpenChange={setShowCreateMatiere} />
    </>
  )
}
