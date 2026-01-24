"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, loading: authLoading, user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [errorDetails, setErrorDetails] = useState<any>(null) // ✅ État pour détails

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      switch (user.role) {
        case "DIRECTEUR_ETUDES":
          router.push("/dashboard")
          break
        case "FORMATEUR":
          router.push("/formateur/travaux")
          break
        case "ETUDIANT":
          router.push("/dashboard/etudiant")
          break
        default:
          router.push("/login")
      }
    }
  }, [authLoading, isAuthenticated, user, router]) // ✅ Correction des dépendances
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setErrorDetails(null) // ✅ Reset
    setLoading(true)

    // ✅ Log de la tentative
    console.log("🔐 Tentative de connexion avec:", { email, password: "***" })

    const result = await login(email, password)

    // ✅ Log du résultat complet
    console.log("📦 Résultat de login:", result)

    if (result.success) {
      toast.success("Bienvenue sur SETICE !")
    } else {
      const errorMsg = result.error || "Email ou mot de passe incorrect"
      setError(errorMsg)
      setErrorDetails(result) // ✅ Capturez tout le résultat
      
      // ✅ Log détaillé de l'erreur
      console.error("❌ Erreur de connexion:", result)
      
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Login Card */}
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-top-4 duration-500">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
            S
          </div>
          <h1 className="text-2xl font-semibold text-foreground">SETICE</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérez votre établissement</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              className={error ? "border-destructive focus-visible:ring-destructive" : ""}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={error ? "border-destructive focus-visible:ring-destructive" : ""}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ✅ NOUVEAU: Détails de l'erreur (pour debug) */}
          {errorDetails && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
              <p className="text-xs font-semibold text-red-800 mb-2">Détails techniques :</p>
              <pre className="text-xs text-red-600 overflow-auto max-h-40 whitespace-pre-wrap">
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
              <p className="text-xs text-red-500 mt-2">
                💡 Ouvrez la console (F12) pour plus d'infos
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Plateforme e-learning pour l'enseignement supérieur
        </p>
      </div>
    </div>
  )
}