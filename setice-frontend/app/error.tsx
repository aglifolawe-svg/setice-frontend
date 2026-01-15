"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive-light">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground">Une erreur est survenue</h1>
      <p className="mt-2 text-muted-foreground">Quelque chose s'est mal passé. Veuillez réessayer.</p>
      <Button onClick={reset} className="mt-6">
        Réessayer
      </Button>
    </div>
  )
}
