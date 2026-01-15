import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground">Page non trouvée</h1>
      <p className="mt-2 text-muted-foreground">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <Button asChild className="mt-6">
        <Link href="/dashboard">Retour au dashboard</Link>
      </Button>
    </div>
  )
}
