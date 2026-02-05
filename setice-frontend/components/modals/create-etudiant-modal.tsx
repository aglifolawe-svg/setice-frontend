"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { usePromotions } from "@/hooks/use-data"
import { useEtudiants } from "@/hooks/useEtudiants"
import type { Etudiant } from "@/types"

interface CreateEtudiantModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingEtudiant?: Etudiant | null
}

export function CreateEtudiantModal({ open, onOpenChange, editingEtudiant }: CreateEtudiantModalProps) {
  const { updateEtudiant, createEtudiant } = useEtudiants()
  const { promotions, isLoading: loadingPromotions } = usePromotions()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    promotionId: "",
    matricule: "",
    temporaryPassword: "",
  })

  // ✅ Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (editingEtudiant) {
      setFormData({
        nom: editingEtudiant.user.nom,
        prenom: editingEtudiant.user.prenom,
        email: editingEtudiant.user.email,
        promotionId: editingEtudiant.promotion?.id || "",
        matricule: editingEtudiant.matricule,
        temporaryPassword: "",
      })
    } else {
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        promotionId: "",
        matricule: "",
        temporaryPassword: "",
      })
    }
    setErrors({})
  }, [editingEtudiant, open])

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
    if (!formData.promotionId) {
      newErrors.promotionId = "Veuillez sélectionner une promotion"
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
      if (editingEtudiant) {
        // ✅ MODE MODIFICATION
        const result = await updateEtudiant(editingEtudiant.id, {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          promotionId: formData.promotionId,
          matricule: formData.matricule,
        })

        if (result.success) {
          toast.success("Étudiant modifié avec succès !")
          onOpenChange(false)
        } else {
          if (result.error?.toLowerCase().includes("email")) {
            setErrors({ email: "Cet email est déjà utilisé" })
          } else if (result.error?.toLowerCase().includes("matricule")) {
            setErrors({ matricule: "Ce matricule est déjà utilisé" })
          } else if (result.error?.toLowerCase().includes("promotion")) {
            setErrors({ promotionId: "Promotion invalide" })
          } else {
            toast.error(result.error || "Erreur lors de la modification")
          }
        }
      } else {
        // ✅ MODE CRÉATION - UTILISE createEtudiant au lieu de api.createEtudiant
        const result = await createEtudiant({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          promotionId: formData.promotionId,
          temporaryPassword: formData.temporaryPassword || undefined,
        })

        if (result.success) {
          toast.success("Étudiant créé avec succès !")
          onOpenChange(false)
          setFormData({ nom: "", prenom: "", email: "", promotionId: "", matricule: "", temporaryPassword: "" })
        } else {
          if (result.error?.toLowerCase().includes("email")) {
            setErrors({ email: "Cet email est déjà utilisé" })
          } else if (result.error?.toLowerCase().includes("promotion")) {
            setErrors({ promotionId: "Promotion invalide" })
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
          <DialogTitle>{editingEtudiant ? "Modifier l'étudiant" : "Créer un étudiant"}</DialogTitle>
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
              placeholder="Marie"
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
              placeholder="marie.dupont@setice.edu"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Matricule (en mode édition seulement) */}
          {editingEtudiant && (
            <div className="space-y-2">
              <Label htmlFor="matricule">Matricule</Label>
              <Input
                id="matricule"
                value={formData.matricule}
                onChange={(e) => handleChange("matricule", e.target.value)}
                placeholder="AUTO-2024-001"
                className={errors.matricule ? "border-destructive" : ""}
              />
              {errors.matricule && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.matricule}
                </p>
              )}
            </div>
          )}

          {/* Mot de passe temporaire (en mode création seulement) */}
          {!editingEtudiant && (
            <div className="space-y-2">
              <Label htmlFor="temporaryPassword">Mot de passe temporaire</Label>
              <Input
                id="temporaryPassword"
                type="password"
                value={formData.temporaryPassword}
                onChange={(e) => handleChange("temporaryPassword", e.target.value)}
                placeholder="Laisser vide pour génération automatique"
              />
              <p className="text-xs text-muted-foreground">
                Ce mot de passe sera envoyé par email à l'étudiant. S'il est vide, un mot de passe sécurisé sera
                généré automatiquement.
              </p>
            </div>
          )}

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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingEtudiant ? "Modification..." : "Création..."}
                </>
              ) : editingEtudiant ? (
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