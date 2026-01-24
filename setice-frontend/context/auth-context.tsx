'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Role, type User } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasAccess: (allowedRoles?: Role[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 🔄 Initialisation depuis le localStorage
  useEffect(() => {
    const token = localStorage.getItem('setice_token')
    const storedUser = localStorage.getItem('setice_user')

    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  // 🔐 LOGIN
  const login = async (email: string, password: string) => {
    const response = await api.login(email, password)

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur de connexion')
    }

    const { token, user } = response.data

    localStorage.setItem('setice_token', token)
    localStorage.setItem('setice_user', JSON.stringify(user))
    setUser(user)

    // 🔀 Redirection par rôle
    switch (user.role) {
      case 'DIRECTEUR_ETUDES':
        router.push('/dashboard')
        break
      case 'FORMATEUR':
        router.push('/formateur')
        break
      case 'ETUDIANT':
        router.push('/etudiant')
        break
      default:
        router.push('/login')
    }
  }

  // 🚪 LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem('setice_token')
    localStorage.removeItem('setice_user')
    setUser(null)
    router.push('/login')
  }, [router])

  // ✅ Vérification d'accès par rôle
  const hasAccess = useCallback(
    (allowedRoles?: Role[]) => {
      if (!user) return false
      if (!allowedRoles || allowedRoles.length === 0) return true
      return allowedRoles.includes(user.role as Role)
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// 🎯 Hook useAuth avec support des rôles
export function useAuth(allowedRoles?: Role[]) {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  const hasAccess = useMemo(
    () => context.hasAccess(allowedRoles),
    [context, allowedRoles]
  )

  return {
    ...context,
    hasAccess,
  }
}

// ✅ Hook useRequireRole - version corrigée
export function useRequireRole(allowedRoles?: Role[]) {
  const router = useRouter()
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useRequireRole must be used within an AuthProvider')
  }

  const { user, isLoading } = context
  
  // Calculer hasAccess comme un booléen
  const hasAccess = useMemo(() => {
    if (!user) return false
    if (!allowedRoles || allowedRoles.length === 0) return true
    return allowedRoles.includes(user.role as Role)
  }, [user, allowedRoles])

  // Redirection automatique
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    } else if (!isLoading && user && !hasAccess) {
      router.push('/dashboard')
    }
  }, [isLoading, user, hasAccess, router])

  return {
    user,
    isLoading,
    hasAccess, // ✅ C'est un booléen, pas une fonction
  }
}