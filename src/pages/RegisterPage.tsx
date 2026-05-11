import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Eye, EyeOff, Loader2, ArrowRight, Check } from 'lucide-react'
import { useAuthStore } from '../store'
import { CURRENT_USER } from '../shared/constants/mockData'
import toast from 'react-hot-toast'

const steps = ['Conta', 'Perfil', 'Preferências']

export function RegisterPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '',
    profession: '', city: '', bio: ''
  })

  const genres = ['Fantasia', 'Ficção Científica', 'Romance', 'Terror', 'Clássicos', 'Filosofia', 'História', 'Negócios', 'Tecnologia', 'HQs', 'Mangás', 'Suspense']

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 2) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    login(CURRENT_USER, 'demo-token')
    toast.success('Conta criada! Bem-vindo ao BiblioVerse 🎉')
    navigate('/feed')
    setLoading(false)
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg">
            Biblio<span className="text-gradient">Verse</span>
          </span>
        </Link>

        <div>
          <h1 className="font-display font-bold text-3xl text-foreground mb-2">Criar sua conta</h1>
          <p className="text-zinc-400">Junte-se a milhares de leitores apaixonados</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-violet-600 text-white' : i === step ? 'bg-violet-600 text-white ring-4 ring-violet-500/20' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs ${i === step ? 'text-foreground' : 'text-zinc-600'}`}>{s}</span>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-zinc-800" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleNext} className="space-y-4">
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nome</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Seu nome" className="input-base" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Username</label>
                  <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="@usuario" className="input-base" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="seu@email.com" className="input-base" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Senha</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Mínimo 8 caracteres" className="input-base pr-10" required minLength={8} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="flex gap-1 mt-2">
                    {[form.password.length >= 8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password)].map((ok, i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full ${ok ? 'bg-green-500' : 'bg-zinc-700'}`} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Profissão</label>
                  <input value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })}
                    placeholder="Ex: Designer" className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Cidade</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Ex: São Paulo" className="input-base" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Bio <span className="text-zinc-600">(opcional)</span></label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Conte um pouco sobre você e seus gostos literários..."
                  className="input-base resize-none h-28" />
              </div>
            </>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Quais gêneros você mais curte?</label>
              <div className="grid grid-cols-3 gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                      selectedGenres.includes(genre)
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                        : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Criando conta...</>
            ) : step < 2 ? (
              <>Continuar <ArrowRight size={16} /></>
            ) : (
              <>Criar minha conta 🎉</>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          Já tem conta?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
