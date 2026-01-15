"use client"

import { useState, useEffect, useCallback } from "react"
import type { EspacePedagogique } from "@/types"
import { api } from "@/lib/api"

export function useEspace(id: string) {
  const [espace, setEspace] = useState<EspacePedagogique | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEspace = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("setice_token")
      const res = await fetch(`http://localhost:3001/api/v1/espaces-pedagogique/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Impossible de récupérer l'espace pédagogique")
      }

      const data = await res.json()
      setEspace(data.data || null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchEspace()
  }, [fetchEspace])

  return { espace, isLoading, error, refetch: fetchEspace }
}
