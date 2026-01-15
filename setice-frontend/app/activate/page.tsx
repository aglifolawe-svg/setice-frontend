"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast" // si tu utilises un système de notifications

export default function ActivatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleActivate = async () => {
    if (!password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:3001/api/v1/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      toast.success("Compte activé avec succès ! Vous pouvez vous connecter.")
      router.push("/login")
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'activation")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Activation du compte</h1>

        <Input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3"
        />
        <Input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4"
        />

        <Button onClick={handleActivate} disabled={isLoading} className="w-full">
          {isLoading ? "Activation..." : "Activer mon compte"}
        </Button>
      </div>
    </div>
  )
}
