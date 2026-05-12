import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  BookOpen, Rss, Library, Grid, BarChart2, User, Search, Moon, Sun,
  Menu, X, Bell, LogOut, Settings, ChevronDown, Check
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

const MOCK_NOTIFICATIONS = [
  { id: '1', text: 'Rafael curtiu sua review de Duna', time: '2min', read: false, icon: '❤️' },
  { id: '2', text: 'Marina começou a seguir você', time: '1h', read: false, icon: '👤' },
  { id: '3', text: 'Novo livro de Patrick Rothfuss adicionado', time: '3h', read: true, icon: '📚' },
  { id: '4', text: 'Você atingiu 47 dias de streak!', time: '1d', read: true, icon: '🔥' },
]

export function Navbar() {
  const { user, logout } = useAuthStore()
  const { darkMode, toggleDarkMode } = useUIStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const navigate = useNavigate()
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Apply dark/light mode to <html>
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      root.classList.remove('light')
      document.body.style.backgroundColor = '#09090B'
      document.body.style.color = '#FAFAFA'
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
      document.body.style.backgroundColor = '#F1F0EF'
      document.body.style.color = '#18181B'
    }
  }, [darkMode])

  // Initialize on mount
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.add('light')
      document.body.style.backgroundColor = '#F1F0EF'
      document.body.style.color = '#18181B'
    }
  }, [])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setSearchOpen(false); setNotifOpen(false); setProfileOpen(false) }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/books?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  // Inline styles for panels that must work in both themes
  const panelStyle: React.CSSProperties = darkMode
    ? { background: '#1C1C1F', border: '1px solid #27272A', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }
    : { background: '#FFFFFF', border: '1px solid #E4E4E7', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }

  const notifItemStyle = (read: boolean): React.CSSProperties => darkMode
    ? { background: read ? 'transparent' : 'rgba(124,58,237,0.07)', borderBottom: '1px solid rgba(39,39,42,0.5)' }
    : { background: read ? 'transparent' : 'rgba(124,58,237,0.05)', borderBottom: '1px solid #F0F0F2' }

  const textPrimary = darkMode ? '#FAFAFA' : '#18181B'
  const textSecondary = darkMode ? '#A1A1AA' : '#52525B'
  const textMuted = darkMode ? '#71717A' : '#A1A1AA'

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
              <span className="font-display font-bold text-lg tracking-tight" style={{ color: textPrimary }}>
                Biblio<span className="text-gradient">Verse</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <Icon size={15} />
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg transition-all"
                style={{ color: textSecondary }}
                title="Buscar"
              >
                <Search size={17} />
              </button>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
                  className="p-2 rounded-lg relative transition-all"
                  style={{ color: notifOpen ? '#A855F7' : textSecondary }}
                  title="Notificações"
                >
                  <Bell size={17} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full border-2"
                      style={{ borderColor: darkMode ? '#09090B' : '#FFFFFF' }} />
                  )}
                </button>

                {notifOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden z-50 animate-slide-down"
                    style={panelStyle}
                  >
                    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: darkMode ? '1px solid #27272A' : '1px solid #E4E4E7' }}>
                      <p className="font-semibold text-sm" style={{ color: textPrimary }}>Notificações</p>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                          <Check size={11} /> Marcar todas como lidas
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          style={notifItemStyle(n.read)}
                          className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                          onClick={() => setNotifications((prev) => prev.map((item) => item.id === n.id ? { ...item, read: true } : item))}
                        >
                          <span className="text-lg flex-shrink-0 mt-0.5">{n.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm leading-snug" style={{ color: textPrimary }}>{n.text}</p>
                            <p className="text-xs mt-0.5" style={{ color: textMuted }}>{n.time} atrás</p>
                          </div>
                          {!n.read && <span className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0 mt-1.5" />}
                        </div>
                      ))}
                    </div>

                    {notifications.length === 0 && (
                      <p className="text-center text-sm py-8" style={{ color: textMuted }}>Nenhuma notificação</p>
                    )}
                  </div>
                )}
              </div>

              {/* Dark/light toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg transition-all"
                style={{ color: textSecondary }}
                title={darkMode ? 'Modo claro' : 'Modo escuro'}
              >
                {darkMode ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* Profile */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
                    className="flex items-center gap-2 p-1.5 rounded-lg transition-all"
                  >
                    <Avatar src={user.avatar} name={user.name} size="sm" />
                    <ChevronDown size={14} style={{ color: textMuted, transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {profileOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden z-50 animate-slide-down"
                      style={panelStyle}
                    >
                      <div className="p-3" style={{ borderBottom: darkMode ? '1px solid #27272A' : '1px solid #E4E4E7' }}>
                        <p className="text-sm font-semibold" style={{ color: textPrimary }}>{user.name}</p>
                        <p className="text-xs" style={{ color: textMuted }}>@{user.username}</p>
                      </div>
                      <div className="p-1.5">
                        {[
                          { to: `/profile/${user.username}`, icon: User, label: 'Meu Perfil' },
                          { to: '/dashboard', icon: BarChart2, label: 'Dashboard' },
                        ].map(({ to, icon: Icon, label }) => (
                          <Link
                            key={to}
                            to={to}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all hover:bg-violet-500/10"
                            style={{ color: textSecondary }}
                            onClick={() => setProfileOpen(false)}
                          >
                            <Icon size={14} />
                            {label}
                          </Link>
                        ))}
                        <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all hover:bg-violet-500/10 w-full text-left"
                          style={{ color: textSecondary }}>
                          <Settings size={14} />
                          Configurações
                        </button>
                      </div>
                      <div className="p-1.5" style={{ borderTop: darkMode ? '1px solid #27272A' : '1px solid #E4E4E7' }}>
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
                <Link to="/login" className="btn-primary text-sm px-4 py-2 ml-1">
                  Entrar
                </Link>
              )}

              {/* Mobile burger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg transition-all"
                style={{ color: textSecondary }}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={darkMode ? { background: 'rgba(9,9,11,0.97)', borderTop: '1px solid #27272A' } : { background: 'rgba(255,255,255,0.97)', borderTop: '1px solid #E4E4E7' }}
            className="md:hidden backdrop-blur-md">
            <div className="p-4 space-y-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `nav-link w-full ${isActive ? 'active' : ''}`}
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
            className="w-full max-w-2xl rounded-2xl overflow-hidden animate-slide-down"
            style={panelStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-3 px-4 py-4">
                <Search size={18} style={{ color: textMuted }} className="flex-shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar livros, autores, gêneros..."
                  style={{
                    background: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    padding: '0',
                    color: textPrimary,
                    fontSize: '16px',
                    width: '100%',
                    outline: 'none',
                  }}
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X size={18} style={{ color: textMuted }} />
                </button>
              </div>
            </form>
            <div style={{ borderTop: darkMode ? '1px solid #27272A' : '1px solid #E4E4E7' }} className="px-4 py-3">
              <p className="text-xs" style={{ color: textMuted }}>Pressione Enter para buscar · Esc para fechar</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
