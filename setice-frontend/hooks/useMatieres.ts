"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import type { Matiere } from "@/types"

export function useMatieres() {
  const [matieres, setMatieres] = useState<Matiere[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMatieres = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.getMatieres()
      
      if (!response.success) {
        throw new Error(response.error || "Impossible de récupérer les matières")
      }
      
      setMatieres(response.data || [])
    } catch (err: any) {
      console.error("Erreur lors de la récupération des matières:", err)
      setError(err.message)
      setMatieres([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ✅ FONCTION CREATE
  const createMatiere = useCallback(async (data: any) => {
    try {
      const response = await api.createMatiere(data)
      
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de la création")
      }

      const newMatiere = response.data as Matiere

      // Ajoute directement la nouvelle matière à la liste
      setMatieres(prev => [...prev, newMatiere])
      
      return { success: true, data: newMatiere }
    } catch (err: any) {
      console.error("Erreur lors de la création:", err)
      return { success: false, error: err.message }
    }
  }, [])

  // ✅ FONCTION DELETE (optionnelle)
  const deleteMatiere = useCallback(async (matiereId: string) => {
    try {
      const response = await api.deleteMatiere(matiereId)
      
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de la suppression")
      }

      setMatieres(prev => prev.filter(m => m.id !== matiereId))
      
      return { success: true }
    } catch (err: any) {
      console.error("Erreur lors de la suppression:", err)
      return { success: false, error: err.message }
    }
  }, [])

  // ✅ FONCTION UPDATE (optionnelle)
  const updateMatiere = useCallback(async (matiereId: string, data: any) => {
    try {
      const response = await api.updateMatiere(matiereId, data)
      
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de la modification")
      }

      const updatedMatiere = response.data as Matiere

      setMatieres(prev => 
        prev.map(m => m.id === matiereId ? updatedMatiere : m)
      )
      
      return { success: true, data: updatedMatiere }
    } catch (err: any) {
      console.error("Erreur lors de la modification:", err)
      return { success: false, error: err.message }
    }
  }, [])

  useEffect(() => {
    fetchMatieres()
  }, [fetchMatieres])

  return { 
    matieres, 
    isLoading, 
    error, 
    refetch: fetchMatieres,
    createMatiere,
    deleteMatiere,
    updateMatiere
  }
}