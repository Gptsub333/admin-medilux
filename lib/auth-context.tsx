"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { AuthContextType, User, Provider, UserRole } from "./types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    // Simulate API call - in production, this would be a real authentication service
    const mockUsers: Record<string, { password: string; id: string }> = {
      "admin@homecare.com": { password: "admin123", id: "admin-1" },
      "provider@homecare.com": { password: "provider123", id: "provider-1" },
    }

    const userKey = email.toLowerCase()
    if (mockUsers[userKey] && mockUsers[userKey].password === password) {
      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")
      const newUser: User = {
        id: mockUsers[userKey].id,
        email,
        role,
        token,
      }
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const signup = async (data: Provider) => {
    // Simulate provider signup - save to localStorage
    const providers: Provider[] = JSON.parse(localStorage.getItem("providers") || "[]")
    const newProvider: Provider = {
      ...data,
      id: `provider-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    }
    providers.push(newProvider)
    localStorage.setItem("providers", JSON.stringify(providers))

    // Auto-login after signup
    const token = Buffer.from(`${data.email}:${Date.now()}`).toString("base64")
    const newUser: User = {
      id: newProvider.id,
      email: data.email,
      role: "provider",
      token,
    }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
