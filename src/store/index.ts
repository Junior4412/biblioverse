import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../shared/types'
import { CURRENT_USER } from '../shared/constants/mockData'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: CURRENT_USER, // pre-logged for demo
      token: 'demo-token',
      isAuthenticated: true,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: 'biblioverse-auth',
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
