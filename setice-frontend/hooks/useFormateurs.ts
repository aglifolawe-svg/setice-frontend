"use client"

import { useState, useEffect, useCallback } from "react"
import type { Formateur } from "@/types"

export function useFormateurs() {
  const [formateurs, setFormateurs] = useState<Formateur[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFormateurs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("http://localhost:3001/api/v1/formateurs")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Impossible de récupérer les formateurs")
      setFormateurs(data.data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFormateurs()
  }, [fetchFormateurs])

  return { formateurs, isLoading, error, refetch: fetchFormateurs }
}
