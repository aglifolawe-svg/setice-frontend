"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useMatieres } from "@/hooks/useMatieres"

interface CreateMatiereModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateMatiereModal({ open, onOpenChange }: CreateMatiereModalProps) {
  const { createMatiere } = useMatieres()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    code: "",
    libelle: "",
    credits: "",
  })

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.code || formData.code.length < 2) {
      newErrors.code = "Le code doit contenir au moins 2 caractères"
    }
    if (!formData.libelle || formData.libelle.length < 3) {
      newErrors.libelle = "Le libellé doit contenir au moins 3 caractères"
    }
    if (!formData.credits || isNaN(Number(formData.credits)) || Number(formData.credits) < 1) {
      newErrors.credits = "Les crédits doivent être un nombre supérieur ou égal à 1"
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
      const result = await createMatiere({
        code: formData.code,
        libelle: formData.libelle,
        credits: Number(formData.credits),
      })

      if (result.success) {
        toast.success("Matière créée avec succès !")
        onOpenChange(false)
        setFormData({ code: "", libelle: "", credits: "" })
      } else {
        if (result.error?.toLowerCase().includes("code")) {
          setErrors({ code: "Ce code est déjà utilisé" })
        } else {
          toast.error(result.error || "Erreur lors de la création")
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
          <DialogTitle>Créer une matière</DialogTitle>
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
              placeholder="GL-101"
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
              placeholder="Génie Logiciel"
              className={errors.libelle ? "border-destructive" : ""}
            />
            {errors.libelle && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.libelle}
              </p>
            )}
          </div>

          {/* Crédits */}
          <div className="space-y-2">
            <Label htmlFor="credits">
              Crédits <span className="text-destructive">*</span>
            </Label>
            <Input
              id="credits"
              type="number"
              min="1"
              value={formData.credits}
              onChange={(e) => handleChange("credits", e.target.value)}
              placeholder="6"
              className={errors.credits ? "border-destructive" : ""}
            />
            {errors.credits && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.credits}
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