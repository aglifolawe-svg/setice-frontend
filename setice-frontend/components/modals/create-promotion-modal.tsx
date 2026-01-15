"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { usePromotions } from "@/hooks/use-data"

interface CreatePromotionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreatePromotionModal({ open, onOpenChange }: CreatePromotionModalProps) {
  const { mutate } = usePromotions()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    code: "",
    libelle: "",
    annee: "",
  })

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.code || formData.code.length < 2) {
      newErrors.code = "Le code est requis"
    }
    if (!formData.libelle || formData.libelle.length < 3) {
      newErrors.libelle = "Le libellé est requis"
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

    const result = await api.createPromotion(formData)

    if (result.success) {
      toast.success("Promotion créée avec succès !")
      mutate()
      onOpenChange(false)
      setFormData({ code: "", libelle: "", annee: "" })
    } else {
      if (result.error?.toLowerCase().includes("code")) {
        setErrors({ code: "Ce code existe déjà" })
      } else {
        toast.error(result.error || "Erreur lors de la création")
      }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une promotion</DialogTitle>
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
  )
}
