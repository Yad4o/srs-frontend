/**
 * useAuth - Authentication hook
 */

import { useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'
import * as authApi from '@/api/auth'

export const useAuth = () => {
  const { user, token, role, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore()

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await authApi.login(email, password)
        const token = response.data.access_token

        // Decode JWT to get user info (basic parsing)
        const decoded = JSON.parse(atob(token.split('.')[1]))
        const user = {
          id: decoded.sub || '',
          email: decoded.email || '',
          role: decoded.role || 'user',
        }

        setAuth(user, token)
        return { success: true, user }
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.detail || 'Login failed',
        }
      }
    },
    [setAuth]
  )

  const register = useCallback(
    async (email: string, password: string, role?: string) => {
      try {
        const response = await authApi.register(email, password, role)
        return { success: true, user: response.data }
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.detail || 'Registration failed',
        }
      }
    },
    []
  )

  const logout = useCallback(() => {
    storeLogout()
  }, [storeLogout])

  return {
    user,
    token,
    role,
    isAuthenticated,
    login,
    register,
    logout,
  }
}
