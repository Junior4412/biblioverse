import { useState } from 'react'
import { Rss, TrendingUp, Users, Bookmark, Filter } from 'lucide-react'
import { ReviewCard } from '../shared/components/ui/ReviewCard'
import { BookCard } from '../shared/components/ui/BookCard'
import { Avatar } from '../shared/components/ui/Avatar'
import { MOCK_REVIEWS, MOCK_BOOKS, MOCK_USERS } from '../shared/constants/mockData'
import { useAuthStore } from '../store'

const tabs = [
  { id: 'feed', label: 'Para Você', icon: Rss },
  { id: 'trending', label: 'Em Alta', icon: TrendingUp },
  { id: 'following', label: 'Seguindo', icon: Users },
  { id: 'saved', label: 'Salvos', icon: Bookmark },
]

export function FeedPage() {
  const [activeTab, setActiveTab] = useState('feed')
  const { user } = useAuthStore()

  const reviews = MOCK_REVIEWS

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            {/* Profile mini */}
            {user && (
              <div className="card-base p-5 text-center">
                <Avatar src={user.avatar} name={user.name} size="lg" className="mx-auto mb-3" />
                <p className="font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-muted">@{user.username}</p>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-800">
                  <div className="text-center">
                    <div className="text-sm font-bold text-foreground">{user.booksRead}</div>
                    <div className="text-xs text-muted">Livros</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-foreground">{user.followers.toLocaleString('pt-BR')}</div>
                    <div className="text-xs text-muted">Seguidores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-foreground">{user.following}</div>
                    <div className="text-xs text-muted">Seguindo</div>
                  </div>
                </div>
                {user.readingStreak && (
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-amber-400">
                    <span>🔥</span>
                    <span>{user.readingStreak} dias de streak</span>
                  </div>
                )}
              </div>
            )}

            {/* Reading goal */}
            {user?.currentGoal && (
              <div className="card-base p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Meta de Leitura 2025</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted">{user.currentGoal.current} de {user.currentGoal.target} livros</span>
                  <span className="text-xs font-semibold text-violet-400">
                    {Math.round((user.currentGoal.current / user.currentGoal.target) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all"
                    style={{ width: `${Math.round((user.currentGoal.current / user.currentGoal.target) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted mt-2">
                  {user.currentGoal.target - user.currentGoal.current} livros restantes
                </p>
              </div>
            )}

            {/* Suggested users */}
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Leitores para seguir</h3>
              <div className="space-y-3">
                {MOCK_USERS.slice(1).map((u) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <Avatar src={u.avatar} name={u.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{u.name}</p>
                      <p className="text-xs text-muted">{u.booksRead} livros</p>
                    </div>
                    <button className="text-xs px-2.5 py-1 rounded-lg border border-violet-500/40 text-violet-400 hover:bg-violet-500/10 transition-all">
                      Seguir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="lg:col-span-6 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-zinc-800" style={{background: "var(--tab-bg, #18181B)"}}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === id
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon size={13} />
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Load more */}
          <div className="text-center">
            <button className="btn-ghost text-sm px-6 py-2.5">
              Carregar mais
            </button>
          </div>
        </main>

        {/* Right sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            {/* Trending books */}
            <div className="card-base p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-violet-400" />
                <h3 className="text-sm font-semibold text-foreground">Em Alta Hoje</h3>
              </div>
              <div className="space-y-3">
                {MOCK_BOOKS.slice(0, 4).map((book, i) => (
                  <div key={book.id} className="flex items-center gap-3 group cursor-pointer">
                    <span className="text-xs font-bold text-zinc-700 w-4">{i + 1}</span>
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-9 h-13 object-cover rounded shadow-md flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/36x52/111113/7C3AED?text=${book.title[0]}`
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground group-hover:text-violet-400 transition-colors line-clamp-1">
                        {book.title}
                      </p>
                      <p className="text-xs text-muted">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Gêneros Populares</h3>
              <div className="flex flex-wrap gap-2">
                {['Fantasia', 'Sci-Fi', 'Clássicos', 'Terror', 'Romance', 'Filosofia'].map((g) => (
                  <span key={g} className="badge badge-primary text-xs cursor-pointer hover:bg-violet-500/25 transition-all">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
