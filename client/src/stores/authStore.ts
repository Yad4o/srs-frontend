/**
 * Auth Store - Zustand state management
 * Manages user, token, and role state globally
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  role: UserRole | null
  isAuthenticated: boolean

  // Actions
  setAuth: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({
          user,
          token,
          role: user.role,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        })
      },

      setUser: (user) => {
        set({
          user,
          role: user.role,
        })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
