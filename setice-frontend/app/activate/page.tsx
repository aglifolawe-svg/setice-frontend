// app/activate/page.tsx (page serveur)
import ActivateForm from "./ActivateForm" // composant client

export default function ActivatePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <ActivateForm />
    </div>
  )
}
