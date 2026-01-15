"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useEspaces, useFormateurs } from "@/hooks/use-data"
import type { EspacePedagogique } from "@/types"

interface AssignFormateurModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  espace: EspacePedagogique | null
}

export function AssignFormateurModal({ open, onOpenChange, espace }: AssignFormateurModalProps) {
  const { mutate } = useEspaces()
  const { formateurs, isLoading: loadingFormateurs } = useFormateurs()
  const [loading, setLoading] = useState(false)
  const [formateurId, setFormateurId] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!formateurId) {
      setError("Veuillez sélectionner un formateur")
      return
    }
    if (!espace) return

    setLoading(true)
    setError("")

    const result = await api.assignFormateur({
      espacePedagogiqueId: espace.id,
      formateurId,
    })

    if (result.success) {
      toast.success("Formateur affecté avec succès !")
      mutate()
      onOpenChange(false)
      setFormateurId("")
    } else {
      toast.error(result.error || "Erreur lors de l'affectation")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le formateur</DialogTitle>
        </DialogHeader>

        {espace && (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium text-foreground">{espace.matiere.libelle}</p>
              <p className="text-xs text-muted-foreground">
                Formateur actuel: {espace.formateur.prenom} {espace.formateur.nom}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="formateurId">
                Nouveau formateur <span className="text-destructive">*</span>
              </Label>
              <Select value={formateurId} onValueChange={setFormateurId}>
                <SelectTrigger className={error ? "border-destructive" : ""}>
                  <SelectValue placeholder={loadingFormateurs ? "Chargement..." : "Sélectionner un formateur"} />
                </SelectTrigger>
                <SelectContent>
                  {formateurs
                    .filter((f) => f.id !== espace.formateur.id)
                    .map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.user.prenom} {f.user.nom} {f.specialite && `(${f.specialite})`}
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Affectation...
                  </>
                ) : (
                  "Affecter"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
