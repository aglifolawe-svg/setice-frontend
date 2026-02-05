"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import type { Formateur } from "@/types"

export function useFormateurs() {
  const [formateurs, setFormateurs] = useState<Formateur[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFormateurs = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.getFormateurs()
      
      if (!response.success) {
        throw new Error(response.error || "Impossible de récupérer les formateurs")
      }
      
      setFormateurs(response.data || [])
    } catch (err: any) {
      console.error("Erreur lors de la récupération des formateurs:", err)
      setError(err.message)
      setFormateurs([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ✅ FONCTION CREATE
  const createFormateur = useCallback(async (data: any) => {
    try {
      const response = await api.createFormateur(data)
      
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de la création")
      }

      const newFormateur = response.data as Formateur

      // Ajoute directement le nouveau formateur à la liste
      setFormateurs(prev => [...prev, newFormateur])
      
      return { success: true, data: newFormateur }
    } catch (err: any) {
      console.error("Erreur lors de la création:", err)
      return { success: false, error: err.message }
    }
  }, [])

  // ✅ FONCTION DELETE
  const deleteFormateur = useCallback(async (formateurId: string) => {
    try {
      const response = await api.deleteFormateur(formateurId)
      
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de la suppression")
      }

      // Met à jour la liste localement
      setFormateurs(prev => prev.filter(f => f.id !== formateurId))
      
      return { success: true }
    } catch (err: any) {
      console.error("Erreur lors de la suppression:", err)
      return { success: false, error: err.message }
    }
  }, [])

  // ✅ FONCTION UPDATE
  const updateFormateur = useCallback(async (formateurId: string, data: any) => {
    try {
      const response = await api.updateFormateur(formateurId, data)
      
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de la modification")
      }

      const updatedFormateur = response.data as Formateur

      // Met à jour la liste localement
      setFormateurs(prev => 
        prev.map(f => f.id === formateurId ? updatedFormateur : f)
      )
      
      return { success: true, data: updatedFormateur }
    } catch (err: any) {
      console.error("Erreur lors de la modification:", err)
      return { success: false, error: err.message }
    }
  }, [])

  useEffect(() => {
    fetchFormateurs()
  }, [fetchFormateurs])

  return { 
    formateurs, 
    isLoading, 
    error, 
    refetch: fetchFormateurs,
    createFormateur,
    deleteFormateur,
    updateFormateur
  }
}