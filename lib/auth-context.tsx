/**
 * CLIENT-SIDE AUTHENTICATION CONTEXT & HOOKS
 * =============================================
 * 
 * Provides React context and hooks for accessing authentication state
 * in client components throughout the application.
 * 
 * Usage:
 * 
 * In a Server Component (for auth check):
 *   import { getAuthenticatedUser } from "@/lib/auth-verify"
 *   const user = await getAuthenticatedUser()
 * 
 * In a Client Component:
 *   import { useAuth, AuthProvider } from "@/lib/auth-context"
 *   
 *   export default function DashboardPage() {
 *     const { user, loading, isAuthenticated } = useAuth()
 *     
 *     if (loading) return <div>Loading...</div>
 *     if (!isAuthenticated) return <div>Not authenticated</div>
 *     
 *     return <div>Hello, {user?.email}</div>
 *   }
 * 
 * Root layout should wrap with:
 *   <AuthProvider>
 *     {children}
 *   </AuthProvider>
 */

"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { UserRole } from "@/lib/constants"

// ============================================================
// TYPES
// ============================================================

export interface AuthUser {
  id: string
  email: string
  username?: string
  role: UserRole
  displayName?: string
}

export interface AuthContextType {
  // State
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  // Methods
  login: (emailOrUsername: string, password: string) => Promise<AuthUser>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

// ============================================================
// CONTEXT CREATION
// ============================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ============================================================
// PROVIDER COMPONENT
// ============================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ============================================================
  // CHECK AUTHENTICATION
  // ============================================================

  const checkAuth = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // Include cookies
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.data as AuthUser)
      } else if (response.status === 401) {
        setUser(null)
      } else {
        setError("Failed to check authentication")
      }
    } catch (err) {
      console.error("Auth check error:", err)
      setError("Failed to check authentication")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================================
  // LOGIN
  // ============================================================

  const login = useCallback(
    async (emailOrUsername: string, password: string) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            emailOrUsername,
            password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Login failed")
        }

        // Store refresh token
        if (data.data?.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken)
        }

        // Update user state
        const authUser = data.data.user as AuthUser
        setUser(authUser)
        return authUser
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed"
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Logout failed")
      }

      // Clear local storage
      localStorage.removeItem("refreshToken")

      // Clear user state
      setUser(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================================
  // REFRESH TOKEN
  // ============================================================

  const refreshToken = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken")

    if (!storedRefreshToken) {
      setUser(null)
      return
    }

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          refreshToken: storedRefreshToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        localStorage.removeItem("refreshToken")
        setUser(null)
        throw new Error("Token refresh failed")
      }

      // Update refresh token if provided
      if (data.data?.refreshToken) {
        localStorage.setItem("refreshToken", data.data.refreshToken)
      }
    } catch (err) {
      console.error("Token refresh error:", err)
      localStorage.removeItem("refreshToken")
      setUser(null)
    }
  }, [])

  // ============================================================
  // CLEAR ERROR
  // ============================================================

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // ============================================================
  // INITIALIZE ON MOUNT
  // ============================================================

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth()
  }, [checkAuth])

  // ============================================================
  // TOKEN REFRESH TIMER
  // ============================================================

  useEffect(() => {
    if (!user) return

    // Refresh token every 7 hours (before 8-hour expiry)
    const refreshInterval = setInterval(() => {
      refreshToken()
    }, 7 * 60 * 60 * 1000)

    return () => clearInterval(refreshInterval)
  }, [user, refreshToken])

  // ============================================================
  // RENDER PROVIDER
  // ============================================================

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    refreshToken,
    checkAuth,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ============================================================
// HOOKS
// ============================================================

/**
 * Hook to access auth context
 * Must be used within <AuthProvider>
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}

/**
 * Hook to check if user has specific role(s)
 */
export function useAuthRole(allowedRoles: UserRole | UserRole[]): boolean {
  const { user } = useAuth()

  if (!user) return false

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  return roles.includes(user.role)
}

/**
 * Hook to get current user
 */
export function useAuthUser(): AuthUser | null {
  const { user } = useAuth()
  return user
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth()
  return isAuthenticated
}

/**
 * Hook to check if auth is still loading
 */
export function useAuthLoading(): boolean {
  const { loading } = useAuth()
  return loading
}
