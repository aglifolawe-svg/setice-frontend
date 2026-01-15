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
import { useFormateurs } from "@/hooks/use-data"

interface CreateFormateurModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateFormateurModal({ open, onOpenChange }: CreateFormateurModalProps) {
  const { mutate } = useFormateurs()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    specialite: "",
  })

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nom || formData.nom.length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères"
    }
    if (!formData.prenom || formData.prenom.length < 2) {
      newErrors.prenom = "Le prénom doit contenir au moins 2 caractères"
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrors({})

    const result = await api.createFormateur(formData)

    if (result.success) {
      toast.success("Formateur créé avec succès !")
      mutate()
      onOpenChange(false)
      setFormData({ nom: "", prenom: "", email: "", specialite: "" })
    } else {
      if (result.error?.toLowerCase().includes("email")) {
        setErrors({ email: "Cet email est déjà utilisé" })
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
          <DialogTitle>Créer un compte formateur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="nom">
              Nom <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              placeholder="DUPONT"
              className={errors.nom ? "border-destructive" : ""}
              autoFocus
            />
            {errors.nom && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.nom}
              </p>
            )}
          </div>

          {/* Prénom */}
          <div className="space-y-2">
            <Label htmlFor="prenom">
              Prénom <span className="text-destructive">*</span>
            </Label>
            <Input
              id="prenom"
              value={formData.prenom}
              onChange={(e) => handleChange("prenom", e.target.value)}
              placeholder="Jean"
              className={errors.prenom ? "border-destructive" : ""}
            />
            {errors.prenom && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.prenom}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="jean.dupont@setice.edu"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Spécialité */}
          <div className="space-y-2">
            <Label htmlFor="specialite">Spécialité</Label>
            <Input
              id="specialite"
              value={formData.specialite}
              onChange={(e) => handleChange("specialite", e.target.value)}
              placeholder="Génie Logiciel"
            />
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
