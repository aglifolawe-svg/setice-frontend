"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import type { Etudiant } from "@/types"

export function useEtudiants() {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEtudiants = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.getEtudiants()
      
      if (!response.success) {
        throw new Error(response.error || "Impossible de récupérer les étudiants")
      }
      
      const validEtudiants = (response.data || []).filter(
        (e: any) => e?.user?.prenom && e?.user?.nom
      )
      
      setEtudiants(validEtudiants)
    } catch (err: any) {
      console.error("Erreur lors de la récupération des étudiants:", err)
      setError(err.message)
      setEtudiants([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ✅ FONCTION DELETE
  const deleteEtudiant = useCallback(async (etudiantId: string) => {
    try {
      const response = await api.deleteEtudiant(etudiantId)
      
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de la suppression")
      }

      // Met à jour la liste localement
      setEtudiants(prev => prev.filter(e => e.id !== etudiantId))
      
      return { success: true }
    } catch (err: any) {
      console.error("Erreur lors de la suppression:", err)
      return { success: false, error: err.message }
    }
  }, [])

  // ✅ FONCTION UPDATE (CORRIGÉE avec typage explicite)
  const updateEtudiant = useCallback(async (etudiantId: string, data: any) => {
    try {
      const response = await api.updateEtudiant(etudiantId, data)
      
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de la modification")
      }

      // ✅ Typage explicite pour éviter les erreurs TypeScript
      const updatedEtudiant = response.data as Etudiant

      // Met à jour la liste localement
      setEtudiants(prev => 
        prev.map(e => e.id === etudiantId ? updatedEtudiant : e)
      )
      
      return { success: true, data: updatedEtudiant }
    } catch (err: any) {
      console.error("Erreur lors de la modification:", err)
      return { success: false, error: err.message }
    }
  }, [])

  useEffect(() => {
    fetchEtudiants()
  }, [fetchEtudiants])

  return { 
    etudiants, 
    isLoading, 
    error, 
    refetch: fetchEtudiants,
    deleteEtudiant,
    updateEtudiant
  }
}