import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '../api/auth'
import type { PublicUser, Role } from '../mocks/db'
import { useCartStore } from './cart'

type SessionState = {
  token: string | null
  user: PublicUser | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  restore: () => Promise<void>
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      async login(email, password) {
        const { token, user } = await authApi.login(email, password)
        set({ token, user })
      },

      async register(name, email, password) {
        const { token, user } = await authApi.register(name, email, password)
        set({ token, user })
      },

      logout() {
        set({ token: null, user: null })
        useCartStore.getState().clear()
      },

      async restore() {
        const { token } = get()
        if (!token) return
        try {
          const { user } = await authApi.me(token)
          set({ user })
        } catch {
          set({ token: null, user: null })
        }
      },
    }),
    { name: 'session' },
  ),
)

export function useRole(): Role | 'guest' {
  return useSessionStore((state) => state.user?.role ?? 'guest')
}
