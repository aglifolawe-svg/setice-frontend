"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { usePromotions } from "@/hooks/usePromotions"
import type { Promotion } from "@/types"

interface CreatePromotionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingPromotion?: Promotion | null
}

export function CreatePromotionModal({ open, onOpenChange, editingPromotion }: CreatePromotionModalProps) {
  const { createPromotion, updatePromotion } = usePromotions()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    code: "",
    libelle: "",
    annee: "",
  })

  // ✅ Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (editingPromotion) {
      setFormData({
        code: editingPromotion.code,
        libelle: editingPromotion.libelle,
        annee: editingPromotion.annee,
      })
    } else {
      setFormData({
        code: "",
        libelle: "",
        annee: "",
      })
    }
    setErrors({})
  }, [editingPromotion, open])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.code || formData.code.length < 2) {
      newErrors.code = "Le code doit contenir au moins 2 caractères"
    }
    if (!formData.libelle || formData.libelle.length < 3) {
      newErrors.libelle = "Le libellé doit contenir au moins 3 caractères"
    }

    // ✅ Validation de l'année académique
    if (!formData.annee || !/^\d{4}-\d{4}$/.test(formData.annee)) {
      newErrors.annee = "Format requis: 2025-2026"
    } else {
      const [anneeDebut, anneeFin] = formData.annee.split("-").map(Number)
      const currentYear = new Date().getFullYear()

      // Vérifier que l'année de fin = année de début + 1
      if (anneeFin !== anneeDebut + 1) {
        newErrors.annee = "L'année de fin doit être l'année suivante (ex: 2025-2026)"
      }
      // Vérifier que l'année de début >= année actuelle
      else if (anneeDebut < currentYear) {
        newErrors.annee = `L'année doit commencer à partir de ${currentYear} (ex: ${currentYear}-${currentYear + 1})`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      if (editingPromotion) {
        // ✅ MODE MODIFICATION
        const result = await updatePromotion(editingPromotion.id, formData)

        if (result.success) {
          toast.success("Promotion modifiée avec succès !")
          onOpenChange(false)
        } else {
          if (result.error?.toLowerCase().includes("code")) {
            setErrors({ code: "Ce code est déjà utilisé" })
          } else {
            toast.error(result.error || "Erreur lors de la modification")
          }
        }
      } else {
        // ✅ MODE CRÉATION
        const result = await createPromotion(formData)

        if (result.success) {
          toast.success("Promotion créée avec succès !")
          onOpenChange(false)
          setFormData({ code: "", libelle: "", annee: "" })
        } else {
          if (result.error?.toLowerCase().includes("code")) {
            setErrors({ code: "Ce code est déjà utilisé" })
          } else {
            toast.error(result.error || "Erreur lors de la création")
          }
        }
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingPromotion ? "Modifier la promotion" : "Créer une promotion"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value)}
              placeholder="L3-SIL-2025"
              className={errors.code ? "border-destructive" : ""}
              autoFocus
            />
            {errors.code && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.code}
              </p>
            )}
          </div>

          {/* Libellé */}
          <div className="space-y-2">
            <Label htmlFor="libelle">
              Libellé <span className="text-destructive">*</span>
            </Label>
            <Input
              id="libelle"
              value={formData.libelle}
              onChange={(e) => handleChange("libelle", e.target.value)}
              placeholder="Licence 3 Systèmes d'Information"
              className={errors.libelle ? "border-destructive" : ""}
            />
            {errors.libelle && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.libelle}
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
              placeholder={`${new Date().getFullYear()}-${new Date().getFullYear() + 1}`}
              className={errors.annee ? "border-destructive" : ""}
            />
            {errors.annee && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.annee}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Format: YYYY-YYYY (ex: {new Date().getFullYear()}-{new Date().getFullYear() + 1})
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingPromotion ? "Modification..." : "Création..."}
                </>
              ) : editingPromotion ? (
                "Modifier"
              ) : (
                "Créer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
