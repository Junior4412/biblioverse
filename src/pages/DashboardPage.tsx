import { BarChart2, BookOpen, Star, TrendingUp, Target, Flame, Award, Clock } from 'lucide-react'
import { useAuthStore } from '../store'
import { MOCK_BOOKS, MOCK_BADGES, MOCK_REVIEWS } from '../shared/constants/mockData'

const monthlyData = [
  { month: 'Jan', books: 3 }, { month: 'Fev', books: 5 }, { month: 'Mar', books: 2 },
  { month: 'Abr', books: 7 }, { month: 'Mai', books: 4 }, { month: 'Jun', books: 6 },
  { month: 'Jul', books: 8 }, { month: 'Ago', books: 5 }, { month: 'Set', books: 9 },
  { month: 'Out', books: 6 }, { month: 'Nov', books: 4 }, { month: 'Dez', books: 3 },
]
const maxBooks = Math.max(...monthlyData.map((d) => d.books))

const genreData = [
  { name: 'Fantasia', pct: 38 }, { name: 'Ficção Científica', pct: 22 },
  { name: 'Clássicos', pct: 18 }, { name: 'Terror', pct: 12 }, { name: 'Outros', pct: 10 },
]

export function DashboardPage() {
  const { user } = useAuthStore()
  const goal = user?.currentGoal ?? { target: 52, current: 38, year: 2025 }
  const goalPct = Math.round((goal.current / goal.target) * 100)
  const earnedBadges = MOCK_BADGES.filter((b) => b.earnedAt)
  const userReviews = MOCK_REVIEWS.slice(0, 3)
  const recentBooks = MOCK_BOOKS.slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-4xl text-foreground mb-2">Dashboard</h1>
        <p className="text-zinc-400">Acompanhe seu progresso de leitura e conquistas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BookOpen, label: 'Livros Lidos', value: user?.booksRead ?? 127, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { icon: Star, label: 'Reviews', value: 43, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { icon: Flame, label: 'Streak Atual', value: `${user?.readingStreak ?? 47} dias`, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { icon: Award, label: 'Badges', value: earnedBadges.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card-base p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-zinc-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Reading chart */}
        <div className="lg:col-span-2 card-base p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-foreground">Livros por Mês</h2>
            <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">2025</span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {monthlyData.map(({ month, books }) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-violet-700 to-violet-500 transition-all"
                    style={{ height: `${(books / maxBooks) * 100}%`, minHeight: '4px' }}
                    title={`${books} livros`}
                  />
                </div>
                <span className="text-[10px] text-zinc-600">{month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className="card-base p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-violet-400" />
            <h2 className="font-semibold text-foreground">Meta de Leitura</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 mb-4">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#27272A" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="url(#goalGrad)" strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - goalPct / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="goalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{goalPct}%</span>
                <span className="text-xs text-zinc-500">concluído</span>
              </div>
            </div>
            <p className="text-sm text-zinc-400 text-center">
              <span className="text-foreground font-semibold">{goal.current}</span> de{' '}
              <span className="text-foreground font-semibold">{goal.target}</span> livros em {goal.year}
            </p>
            <p className="text-xs text-zinc-600 mt-2 text-center">
              Faltam {goal.target - goal.current} livros para bater a meta!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Genres */}
        <div className="card-base p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-violet-400" /> Gêneros Favoritos
          </h2>
          <div className="space-y-3">
            {genreData.map(({ name, pct }) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">{name}</span>
                  <span className="text-zinc-500">{pct}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent books */}
        <div className="card-base p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock size={16} className="text-violet-400" /> Lidos Recentemente
          </h2>
          <div className="space-y-3">
            {recentBooks.map((book) => (
              <div key={book.id} className="flex items-center gap-3">
                <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
                  <p className="text-xs text-zinc-500 truncate">{book.author}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-zinc-500">{book.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="card-base p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award size={16} className="text-violet-400" /> Conquistas
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {MOCK_BADGES.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                  badge.earnedAt
                    ? 'bg-violet-500/10 border border-violet-500/20'
                    : 'bg-zinc-900/50 border border-zinc-800 opacity-40 grayscale'
                }`}
                title={badge.description}
              >
                <span className="text-xl">{badge.icon}</span>
                <span className="text-[10px] text-zinc-400 text-center leading-tight">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent reviews */}
      <div className="card-base p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Star size={16} className="text-violet-400" /> Minhas Reviews Recentes
        </h2>
        <div className="space-y-4">
          {userReviews.map((review) => (
            <div key={review.id} className="flex gap-4 p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/60">
              <img src={review.book.cover} alt={review.book.title} className="w-12 h-16 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{review.book.title}</p>
                <div className="flex gap-0.5 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'} />
                  ))}
                </div>
                <p className="text-sm text-zinc-400 line-clamp-2">{review.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
