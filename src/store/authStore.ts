import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, setToken, getToken } from '../lib/api'

export interface AuthUser {
  id: string
  name: string
  email: string
  phone?: string
  role: 'customer' | 'admin'
  loyaltyPoints: number
  loyaltyLevel: string
  wishlist?: string[]
  addresses?: unknown[]
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
  updateProfile: (data: Partial<AuthUser>) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: getToken(),
      loading: false,
      login: async (email, password) => {
        const data = await api<{ token: string; user: AuthUser }>('/auth/login', {
          method: 'POST',
          json: { email, password },
        })
        setToken(data.token)
        set({ user: data.user, token: data.token })
      },
      register: async (name, email, password, phone) => {
        const data = await api<{ token: string; user: AuthUser }>('/auth/register', {
          method: 'POST',
          json: { name, email, password, phone },
        })
        setToken(data.token)
        set({ user: data.user, token: data.token })
      },
      logout: () => {
        setToken(null)
        set({ user: null, token: null })
      },
      refreshMe: async () => {
        if (!getToken()) return
        try {
          const data = await api<{ user: AuthUser }>('/auth/me')
          set({ user: data.user })
        } catch {
          get().logout()
        }
      },
      updateProfile: async (data) => {
        const res = await api<{ user: AuthUser }>('/auth/me', { method: 'PUT', json: data })
        set({ user: res.user })
      },
    }),
    {
      name: 'spicebox-auth-v2',
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setToken(state.token)
      },
    },
  ),
)
