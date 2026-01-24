"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, loading, user } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        // Redirect based on role
        switch (user.role) {
          case "FORMATEUR":
            router.push("/formateur")
            break
          case "ETUDIANT":
            router.push("/etudiant")
            break
          case "DIRECTEUR_ETUDES":
            router.push("/dashboard")
            break
          default:
            router.push("/login")
        }
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, loading, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
