import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  BookOpen, Rss, Library, Grid, BarChart2, User, Search, Moon, Sun,
  Menu, X, Bell, LogOut, Settings, ChevronDown
} from 'lucide-react'
import { useAuthStore, useUIStore } from '../../../store'
import { Avatar } from './Avatar'

const navItems = [
  { to: '/feed', label: 'Feed', icon: Rss },
  { to: '/books', label: 'Explorar', icon: BookOpen },
  { to: '/libraries', label: 'Bibliotecas', icon: Library },
  { to: '/genres', label: 'Gêneros', icon: Grid },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart2 },
]

export function Navbar() {
  const { user, logout } = useAuthStore()
  const { darkMode, toggleDarkMode } = useUIStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/books?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-glow-sm">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-foreground">
                Biblio<span className="text-gradient">Verse</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
                title="Buscar"
              >
                <Search size={17} />
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all relative">
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
              </button>

              {/* Dark mode */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
              >
                {darkMode ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* Profile dropdown */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <Avatar src={user.avatar} name={user.name} size="sm" />
                    <ChevronDown size={14} className={`text-zinc-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 glass-light border border-zinc-800 rounded-xl shadow-card overflow-hidden animate-slide-down">
                      <div className="p-3 border-b border-zinc-800">
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted">@{user.username}</p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          to={`/profile/${user.username}`}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/6 hover:text-white transition-all"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User size={14} />
                          Meu Perfil
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/6 hover:text-white transition-all"
                          onClick={() => setProfileOpen(false)}
                        >
                          <BarChart2 size={14} />
                          Dashboard
                        </Link>
                        <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/6 hover:text-white transition-all w-full text-left">
                          <Settings size={14} />
                          Configurações
                        </button>
                      </div>
                      <div className="p-1.5 border-t border-zinc-800">
                        <button
                          onClick={() => { logout(); navigate('/login') }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
                        >
                          <LogOut size={14} />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn-primary text-sm px-4 py-2">
                  Entrar
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
            <div className="p-4 space-y-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `nav-link w-full ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl glass border border-zinc-700 rounded-2xl shadow-card overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-3 px-4 py-4">
                <Search size={18} className="text-zinc-500 flex-shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar livros, autores, gêneros..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-zinc-600 outline-none text-base"
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X size={18} className="text-zinc-600 hover:text-zinc-400" />
                </button>
              </div>
            </form>
            <div className="border-t border-zinc-800 px-4 py-3">
              <p className="text-xs text-zinc-600">Pressione Enter para buscar · Esc para fechar</p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </>
  )
}
