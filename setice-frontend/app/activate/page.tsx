'use client'

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"

export default function ActivatePage() {
  const searchParams = useSearchParams()
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // ✅ Récupère le token après le rendu initial pour éviter le warning Suspense
  useEffect(() => {
    const t = searchParams.get("token")
    if (t) setToken(t)
  }, [searchParams])

  const handleActivate = async () => {
    if (!token) {
      toast.error("Token manquant dans l'URL")
      return
    }
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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://upstack-react-base.onrender.com/api/v1"
      const res = await fetch(`${API_URL}/etudiants/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      })
      const data = await res.json()

      if (!data.success) throw new Error(data.error || "Activation échouée")

      toast.success("✅ Compte activé avec succès !")

      setTimeout(() => {
        window.location.href = `/login?activated=${Date.now()}`
      }, 1500)
    } catch (err: any) {
      console.error("❌ Erreur activation :", err)
      toast.error(err.message || "Erreur lors de l'activation")
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
          disabled={isLoading}
          autoComplete="new-password"
        />
        <Input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4"
          disabled={isLoading}
          autoComplete="new-password"
        />

        <Button onClick={handleActivate} disabled={isLoading} className="w-full">
          {isLoading ? "Activation en cours..." : "Activer mon compte"}
        </Button>
      </div>
    </div>
  )
}
