import { Loader2 } from "lucide-react"

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = "Chargement..." }: LoadingPageProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
