"use client"

import useSWR from "swr"
import { api } from "@/lib/api"
import type { EspacePedagogique, Formateur, Etudiant, Promotion, Matiere } from "@/types"

// SWR fetchers
const fetchEspaces = async () => {
  const result = await api.getEspaces()
  if (!result.success) throw new Error(result.error)
  return result.data
}

const fetchFormateurs = async () => {
  const result = await api.getFormateurs()
  if (!result.success) throw new Error(result.error)
  return result.data
}

const fetchEtudiants = async () => {
  const result = await api.getEtudiants()
  if (!result.success) throw new Error(result.error)
  return result.data
}

const fetchPromotions = async () => {
  const result = await api.getPromotions()
  if (!result.success) throw new Error(result.error)
  return result.data
}

const fetchMatieres = async () => {
  const result = await api.getMatieres()
  if (!result.success) throw new Error(result.error)
  return result.data
}

export function useEspaces() {
  const { data, error, isLoading, mutate } = useSWR<EspacePedagogique[]>("espaces", fetchEspaces)
  return {
    espaces: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useFormateurs() {
  const { data, error, isLoading, mutate } = useSWR<Formateur[]>("formateurs", fetchFormateurs)
  return {
    formateurs: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useEtudiants() {
  const { data, error, isLoading, mutate } = useSWR<Etudiant[]>("etudiants", fetchEtudiants)
  return {
    etudiants: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function usePromotions() {
  const { data, error, isLoading, mutate } = useSWR<Promotion[]>("promotions", fetchPromotions)
  return {
    promotions: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useMatieres() {
  const { data, error, isLoading, mutate } = useSWR<Matiere[]>("matieres", fetchMatieres)
  return {
    matieres: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useDashboardStats() {
  const { espaces, isLoading: loadingEspaces } = useEspaces()
  const { formateurs, isLoading: loadingFormateurs } = useFormateurs()
  const { etudiants, isLoading: loadingEtudiants } = useEtudiants()

  return {
    stats: {
      espacesCount: espaces.length,
      formateursCount: formateurs.length,
      etudiantsCount: etudiants.length,
    },
    recentEspaces: espaces.slice(0, 5),
    isLoading: loadingEspaces || loadingFormateurs || loadingEtudiants,
  }
}
