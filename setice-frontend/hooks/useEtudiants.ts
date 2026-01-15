"use client"

import { useState, useEffect, useCallback } from "react"
import type { Etudiant } from "@/types"

export function useEtudiants() {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEtudiants = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token") // ou ton gestionnaire JWT
      const res = await fetch("http://localhost:3001/api/v1/etudiants/create", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      })

      if (!res.ok) throw new Error("Impossible de récupérer les étudiants")

      const data = await res.json()
      setEtudiants(data.data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // fetch au montage du composant
  useEffect(() => {
    fetchEtudiants()
  }, [fetchEtudiants])

  return { etudiants, isLoading, error, refetch: fetchEtudiants }
}
