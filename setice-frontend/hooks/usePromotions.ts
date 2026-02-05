"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import type { Promotion } from "@/types"

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPromotions = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.getPromotions()
      
      if (!response.success) {
        throw new Error(response.error || "Impossible de récupérer les promotions")
      }
      
      setPromotions(response.data || [])
    } catch (err: any) {
      console.error("Erreur lors de la récupération des promotions:", err)
      setError(err.message)
      setPromotions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ✅ FONCTION CREATE
  const createPromotion = useCallback(async (data: any) => {
    try {
      const response = await api.createPromotion(data)
      
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de la création")
      }

      const newPromotion = response.data as Promotion

      // Ajoute directement la nouvelle promotion à la liste
      setPromotions(prev => [...prev, newPromotion])
      
      return { success: true, data: newPromotion }
    } catch (err: any) {
      console.error("Erreur lors de la création:", err)
      return { success: false, error: err.message }
    }
  }, [])

  // ✅ FONCTION DELETE
  const deletePromotion = useCallback(async (promotionId: string) => {
    try {
      const response = await api.deletePromotion(promotionId)
      
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de la suppression")
      }

      // Met à jour la liste localement
      setPromotions(prev => prev.filter(p => p.id !== promotionId))
      
      return { success: true }
    } catch (err: any) {
      console.error("Erreur lors de la suppression:", err)
      return { success: false, error: err.message }
    }
  }, [])

  // ✅ FONCTION UPDATE
  const updatePromotion = useCallback(async (promotionId: string, data: any) => {
    try {
      const response = await api.updatePromotion(promotionId, data)
      
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de la modification")
      }

      const updatedPromotion = response.data as Promotion

      // Met à jour la liste localement
      setPromotions(prev => 
        prev.map(p => p.id === promotionId ? updatedPromotion : p)
      )
      
      return { success: true, data: updatedPromotion }
    } catch (err: any) {
      console.error("Erreur lors de la modification:", err)
      return { success: false, error: err.message }
    }
  }, [])

  useEffect(() => {
    fetchPromotions()
  }, [fetchPromotions])

  return { 
    promotions, 
    isLoading, 
    error, 
    refetch: fetchPromotions,
    createPromotion,
    deletePromotion,
    updatePromotion
  }
}