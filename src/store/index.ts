import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../shared/types'
import { mapAuthUser, supabase } from '../lib/supabase'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  initialized: boolean
  login: (user: User, token: string) => void
  initialize: () => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      initialized: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      initialize: async () => {
        const { data } = await supabase.auth.getSession()
        const session = data.session
        set({
          user: session ? mapAuthUser(session.user) : null,
          token: session?.access_token ?? null,
          isAuthenticated: Boolean(session),
          initialized: true,
        })
        supabase.auth.onAuthStateChange((_event, nextSession) => {
          set({
            user: nextSession ? mapAuthUser(nextSession.user) : null,
            token: nextSession?.access_token ?? null,
            isAuthenticated: Boolean(nextSession),
          })
        })
      },
      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, token: null, isAuthenticated: false })
      },
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: 'biblioverse-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)

interface UIState {
  sidebarOpen: boolean
  searchOpen: boolean
  darkMode: boolean
  toggleSidebar: () => void
  toggleSearch: () => void
  toggleDarkMode: () => void
  setSearchOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
  searchOpen: false,
  darkMode: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  setSearchOpen: (open) => set({ searchOpen: open }),
}))
