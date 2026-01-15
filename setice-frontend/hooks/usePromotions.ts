"use client"

import { useState, useEffect, useCallback } from "react"
import type { Promotion } from "@/types"

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPromotions = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token") // ou ton gestionnaire JWT
      const res = await fetch("http://localhost:3001/api/v1/promotions/create", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      })

      if (!res.ok) throw new Error("Impossible de récupérer les promotions")

      const data = await res.json()
      setPromotions(data.data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // fetch au montage du composant
  useEffect(() => {
    fetchPromotions()
  }, [fetchPromotions])

  return { promotions, isLoading, error, refetch: fetchPromotions }
}
