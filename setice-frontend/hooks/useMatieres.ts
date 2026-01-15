// src/hooks/use-matieres.ts
"use client"

import { useState, useEffect, useCallback } from "react"
import type { Matiere } from "@/types"

export function useMatieres() {
  const [matieres, setMatieres] = useState<Matiere[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMatieres = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token") // si tu utilises JWT côté frontend
      const res = await fetch("http://localhost:3001/api/v1/matieres/create", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      })

      if (!res.ok) throw new Error("Impossible de récupérer les matières")

      const data = await res.json()
      setMatieres(data.data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMatieres()
  }, [fetchMatieres])

  return { matieres, isLoading, error, refetch: fetchMatieres }
}
