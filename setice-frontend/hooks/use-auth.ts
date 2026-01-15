"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { User } from "@/types"

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("setice_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("setice_user")
        localStorage.removeItem("setice_token")
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await api.login(email, password)

      if (result.success && result.data) {
        localStorage.setItem("setice_token", result.data.token)
        localStorage.setItem("setice_user", JSON.stringify(result.data.user))
        setUser(result.data.user)
        router.push("/dashboard")
        return { success: true }
      }

      return { success: false, error: result.error || "Erreur de connexion" }
    },
    [router],
  )

  const logout = useCallback(() => {
    localStorage.removeItem("setice_token")
    localStorage.removeItem("setice_user")
    setUser(null)
    router.push("/login")
  }, [router])

  const isAuthenticated = !!user

  return { user, loading, login, logout, isAuthenticated }
}
