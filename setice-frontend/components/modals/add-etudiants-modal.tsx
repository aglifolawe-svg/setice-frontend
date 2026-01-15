"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle, Users } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { usePromotions, useEtudiants } from "@/hooks/use-data"
import type { EspacePedagogique } from "@/types"

interface AddEtudiantsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  espace: EspacePedagogique | null
  onEtudiantsAdded?: () => void // <-- callback pour refetch après ajout
}

export function AddEtudiantsModal({ open, onOpenChange, espace, onEtudiantsAdded }: AddEtudiantsModalProps) {
  const { promotions, isLoading: loadingPromotions } = usePromotions()
  const { etudiants } = useEtudiants()
  const [loading, setLoading] = useState(false)
  const [promotionId, setPromotionId] = useState("")
  const [error, setError] = useState("")

  // Sélection de la promotion et nombre d'étudiants à inscrire
  const selectedPromotion = promotions.find((p) => p.id === promotionId)
  const etudiantsInPromotion = etudiants.filter((e) => e.promotion?.id === promotionId)

  useEffect(() => {
    if (!open) {
      setPromotionId("")
      setError("")
    }
  }, [open])

  const handleSubmit = async () => {
    if (!promotionId) {
      setError("Veuillez sélectionner une promotion")
      return
    }
    if (!espace) return

    setLoading(true)
    setError("")

    try {
      const result = await api.addEtudiants({
        espacePedagogiqueId: espace.id,
        promotionId,
        matiereId: ""
      })

      if (result.success && result.data) {
        const { inscrits, dejaInscrits } = result.data
        let message = `${inscrits} étudiant(s) inscrit(s) avec succès`
        if (dejaInscrits > 0) message += ` (${dejaInscrits} déjà inscrit(s))`

        toast.success(message)

        // 🔹 Ici on appelle la callback pour mettre à jour l'espace courant
        onEtudiantsAdded?.()

        onOpenChange(false)
      } else {
        toast.error(result.error || "Erreur lors de l'inscription")
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inscrire des étudiants</DialogTitle>
        </DialogHeader>

        {espace && (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium text-foreground">{espace.matiere.libelle}</p>
              <p className="text-xs text-muted-foreground">Étudiants actuels: {espace.etudiants?.length ?? 0}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotionId">
                Promotion à inscrire <span className="text-destructive">*</span>
              </Label>
              <Select value={promotionId} onValueChange={setPromotionId}>
                <SelectTrigger className={error ? "border-destructive" : ""}>
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
              {error && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {error}
                </p>
              )}
            </div>

            {/* Aperçu du nombre d'étudiants */}
            {selectedPromotion && (
              <div className="flex items-center gap-2 rounded-md bg-primary-light p-3">
                <Users className="h-5 w-5 text-primary" />
                <p className="text-sm text-primary">
                  <strong>{etudiantsInPromotion.length}</strong> étudiants seront inscrits
                </p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inscription...
                  </>
                ) : (
                  "Inscrire"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
