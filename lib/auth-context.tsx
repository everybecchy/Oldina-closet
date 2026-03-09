"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string | null
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; redirectTo?: string; error?: string }>
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<{ success: boolean; redirectTo?: string; error?: string }>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    console.log("[v0] auth-context: refreshSession chamado")
    try {
      const response = await fetch("/api/auth/session")
      console.log("[v0] auth-context: session response status:", response.status)
      const data = await response.json()
      console.log("[v0] auth-context: session data:", data)
      setUser(data.user || null)
      console.log("[v0] auth-context: user setado para:", data.user || null)
    } catch (err) {
      console.log("[v0] auth-context: erro no refreshSession:", err)
      setUser(null)
    } finally {
      console.log("[v0] auth-context: finalizando isLoading")
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const login = async (email: string, password: string) => {
    try {
      console.log("[v0] auth-context: Iniciando login para", email)
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      console.log("[v0] auth-context: Response status:", response.status)
      
      const data = await response.json()
      console.log("[v0] auth-context: Response data:", data)

      if (!response.ok) {
        console.log("[v0] auth-context: Login falhou:", data.error)
        return { success: false, error: data.error }
      }

      console.log("[v0] auth-context: Login sucesso, setando user:", data.user)
      setUser(data.user)
      
      // Determinar redirect baseado no tipo de usuário
      const redirectTo = data.user?.isAdmin ? "/dashboard" : "/minha-conta"
      console.log("[v0] auth-context: Redirect para:", redirectTo)
      return { success: true, redirectTo }
    } catch (err) {
      console.log("[v0] auth-context: Erro catch:", err)
      return { success: false, error: "Erro ao fazer login" }
    }
  }

  const register = async (formData: { name: string; email: string; phone?: string; password: string }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      setUser(data.user)
      return { success: true, redirectTo: data.redirectTo }
    } catch {
      return { success: false, error: "Erro ao criar conta" }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
    } catch {
      console.error("Erro ao fazer logout")
    }
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      loading: isLoading, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      refreshSession 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
