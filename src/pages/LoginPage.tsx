import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store'
import { CURRENT_USER } from '../shared/constants/mockData'
import toast from 'react-hot-toast'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    login(CURRENT_USER, 'demo-token')
    toast.success('Bem-vinda de volta, Ana! 📚')
    navigate('/feed')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-glow-sm">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg">
              Biblio<span className="text-gradient">Verse</span>
            </span>
          </Link>

          <div>
            <h1 className="font-display font-bold text-3xl text-foreground mb-2">Bem-vindo de volta</h1>
            <p className="text-zinc-400">Entre para continuar sua jornada literária</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="input-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900" />
                <span className="text-sm text-zinc-400">Lembrar de mim</span>
              </label>
              <a href="#" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                Esqueci a senha
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Entrando...</>
              ) : (
                <>Entrar <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 bg-background text-zinc-600">ou continue com</span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-ghost flex items-center justify-center gap-2 py-2.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="btn-ghost flex items-center justify-center gap-2 py-2.5">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-zinc-500">
            Não tem conta?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
              Criar gratuitamente
            </Link>
          </p>
        </div>
      </div>

      {/* Right side — visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-[80px]" />

        {/* Floating book cards */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="grid grid-cols-3 gap-4 p-12 rotate-6">
            {[
              { title: 'Duna', author: 'Frank Herbert', rating: 5, delay: '0s' },
              { title: 'O Pequeno Príncipe', author: 'Saint-Exupéry', rating: 5, delay: '0.3s' },
              { title: 'Sapiens', author: 'Yuval Harari', rating: 4, delay: '0.6s' },
              { title: '1984', author: 'George Orwell', rating: 5, delay: '0.1s' },
              { title: 'O Nome do Vento', author: 'Patrick Rothfuss', rating: 5, delay: '0.4s' },
              { title: 'Atomic Habits', author: 'James Clear', rating: 4, delay: '0.7s' },
            ].map(({ title, author, rating, delay }) => (
              <div
                key={title}
                className="glass border border-zinc-700/50 rounded-xl p-4 animate-float"
                style={{ animationDelay: delay }}
              >
                <div className="w-full aspect-[3/4] bg-gradient-to-br from-violet-800/40 to-purple-900/40 rounded-lg mb-3 flex items-center justify-center text-3xl">
                  📚
                </div>
                <p className="text-xs font-semibold text-foreground line-clamp-1">{title}</p>
                <p className="text-xs text-zinc-500">{author}</p>
                <div className="flex gap-0.5 mt-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-2.5 h-2.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700 fill-zinc-700'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-8 left-8 right-8">
            <div className="glass border border-zinc-700/50 rounded-2xl p-5">
              <p className="text-sm font-semibold text-foreground mb-1">
                "BiblioVerse transformou minha forma de ler"
              </p>
              <p className="text-xs text-zinc-500">
                "A comunidade é incrível e as recomendações são sempre certeiras."
              </p>
              <div className="flex items-center gap-2 mt-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marina"
                  className="w-7 h-7 rounded-full"
                  alt="Marina"
                />
                <div>
                  <p className="text-xs font-medium text-foreground">Marina Oliveira</p>
                  <p className="text-xs text-zinc-600">213 livros lidos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
