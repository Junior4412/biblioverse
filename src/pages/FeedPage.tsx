'tsx'
import { useEffect, useState } from 'react'
import { Rss, TrendingUp, Users, Bookmark } from 'lucide-react'
import { ReviewCard } from '../shared/components/ui/ReviewCard'
import { Avatar } from '../shared/components/ui/Avatar'
import { useAuthStore } from '../store'
import { supabase } from '../lib/supabase'

const tabs = [
  { id: 'feed', label: 'Para Você', icon: Rss },
  { id: 'trending', label: 'Em Alta', icon: TrendingUp },
  { id: 'following', label: 'Seguindo', icon: Users },
  { id: 'saved', label: 'Salvos', icon: Bookmark },
]

interface ProfileData {
  id: string
  name: string
  username: string
  email: string
  avatar?: string | null
  bio?: string | null
  profession?: string | null
  city?: string | null
  booksRead: number
  followers: number
  following: number
  createdAt?: string
  readingStreak?: number
}

interface BookData {
  id: string
  title: string
  author: string
  cover_url?: string | null
  cover?: string | null
  rating?: number | null
  review_count?: number | null
  published_at?: string | null
  pages?: number | null
  trending?: boolean | null
  tags?: string[] | null
  genres?: {
    name: string
  }[] | null
}

interface ReviewData {
  id: string
  content: string
  rating: number
  created_at: string
  likes: number
  comments: number
  liked: boolean
  saved: boolean
  user: ProfileData
  book: BookData
}

export function FeedPage() {
  const [activeTab, setActiveTab] = useState('feed')
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [trendingBooks, setTrendingBooks] = useState<BookData[]>([])
  const [popularGenres, setPopularGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const { user } = useAuthStore()

  useEffect(() => {
    async function loadFeed() {
      setLoading(true)

      // =========================
      // REVIEWS REAIS
      // =========================
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          book_id,
          content,
          rating,
          likes,
          comments,
          created_at,
          profiles (
            id,
            name,
            username,
            email,
            avatar,
            bio,
            profession,
            city,
            books_read,
            followers,
            following,
            created_at,
            reading_streak
          ),
          books (
            id,
            title,
            author,
            cover_url,
            cover,
            rating,
            review_count,
            published_at,
            pages,
            trending,
            tags,
            genres (
              name
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      if (reviewsError) {
        console.error('Erro ao carregar reviews:', reviewsError)
      }

      const formattedReviews: ReviewData[] = (reviewsData ?? [])
        .map((review: any) => {
          const profile = Array.isArray(review.profiles)
            ? review.profiles[0] ?? null
            : review.profiles ?? null

          const book = Array.isArray(review.books)
            ? review.books[0] ?? null
            : review.books ?? null

          if (!profile || !book) return null

          const genres = Array.isArray(book.genres)
            ? book.genres
            : book.genres
              ? [book.genres]
              : []

          const formattedUser: ProfileData = {
            id: profile.id,
            name: profile.name ?? 'Usuário',
            username: profile.username ?? '',
            email: profile.email ?? '',
            avatar: profile.avatar,
            bio: profile.bio,
            profession: profile.profession,
            city: profile.city,
            booksRead: Number(profile.books_read ?? 0),
            followers: Number(profile.followers ?? 0),
            following: Number(profile.following ?? 0),
            createdAt: profile.created_at,
            readingStreak: Number(profile.reading_streak ?? 0),
          }

          const formattedBook: BookData = {
            id: book.id,
            title: book.title ?? 'Sem título',
            author: book.author ?? 'Autor desconhecido',
            cover_url: book.cover_url,
            cover: book.cover,
            rating:
              book.rating !== null && book.rating !== undefined
                ? Number(book.rating)
                : null,
            review_count:
              book.review_count !== null &&
              book.review_count !== undefined
                ? Number(book.review_count)
                : null,
            published_at: book.published_at,
            pages: book.pages,
            trending: Boolean(book.trending),
            tags: Array.isArray(book.tags) ? book.tags : [],
            genres,
          }

          return {
            id: review.id,
            content: review.content ?? '',
            rating: Number(review.rating ?? 0),
            created_at: review.created_at,
            likes: Number(review.likes ?? 0),
            comments: Number(review.comments ?? 0),
            liked: false,
            saved: false,
            user: formattedUser,
            book: formattedBook,
          }
        })
        .filter(Boolean) as ReviewData[]

      setReviews(formattedReviews)

      // =========================
      // LIVROS EM ALTA REAIS
      // =========================
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select(`
          id,
          title,
          author,
          cover_url,
          cover,
          rating,
          review_count,
          published_at,
          pages,
          trending,
          tags,
          genres (
            name
          )
        `)
        .order('rating', { ascending: false })
        .limit(10)

      if (booksError) {
        console.error('Erro ao carregar livros:', booksError)
      }

      const formattedBooks = (booksData ?? []).map((book: any) => ({
        ...book,
        genres: Array.isArray(book.genres)
          ? book.genres
          : book.genres
            ? [book.genres]
            : [],
      })) as BookData[]

      setTrendingBooks(formattedBooks.slice(0, 4))

      // =========================
      // GÊNEROS REAIS
      // =========================
      const genres = formattedBooks
        .flatMap((book) => book.genres ?? [])
        .map((genre) => genre.name)
        .filter(Boolean)

      setPopularGenres([...new Set(genres)].slice(0, 8))

      setLoading(false)
    }

    loadFeed()
  }, [])

  // =========================
  // FILTROS DAS ABAS
  // =========================
  const visibleReviews = (() => {
    if (activeTab === 'feed') {
      return reviews
    }

    if (activeTab === 'following') {
      // Enquanto não houver sistema de seguidores
      // com dados reais para este usuário, não mostramos
      // pessoas ou reviews falsas.
      return user ? reviews : []
    }

    if (activeTab === 'saved') {
      // Os salvos serão conectados à tabela review_saves
      // quando houver usuário logado.
      return []
    }

    if (activeTab === 'trending') {
      return reviews
        .slice()
        .sort((a, b) => {
          const scoreA = a.likes + a.comments
          const scoreB = b.likes + b.comments

          return scoreB - scoreA
        })
    }

    return reviews
  })()

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="card-base p-10 text-center">
          <p className="text-zinc-400">
            Carregando feed...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* =========================
            LEFT SIDEBAR
        ========================= */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">

            {/* Profile */}
            {user && (
              <div className="card-base p-5 text-center">
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  size="lg"
                  className="mx-auto mb-3"
                />

                <p className="font-semibold text-foreground">
                  {user.name}
                </p>

                <p className="text-xs text-muted">
                  @{user.username}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-800">
                  <div className="text-center">
                    <div className="text-sm font-bold text-foreground">
                      {user.booksRead}
                    </div>

                    <div className="text-xs text-muted">
                      Livros
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-bold text-foreground">
                      {user.followers.toLocaleString('pt-BR')}
                    </div>

                    <div className="text-xs text-muted">
                      Seguidores
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-bold text-foreground">
                      {user.following}
                    </div>

                    <div className="text-xs text-muted">
                      Seguindo
                    </div>
                  </div>
                </div>

                {user.readingStreak && user.readingStreak > 0 && (
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-amber-400">
                    <span>🔥</span>
                    <span>
                      {user.readingStreak} dias de streak
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Reading goal */}
            {user?.currentGoal && (
              <div className="card-base p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Meta de Leitura {user.currentGoal.year}
                </h3>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted">
                    {user.currentGoal.current} de{' '}
                    {user.currentGoal.target} livros
                  </span>

                  <span className="text-xs font-semibold text-[#5E6E4E]">
                    {Math.round(
                      (user.currentGoal.current /
                        Math.max(user.currentGoal.target, 1)) *
                        100
                    )}
                    %
                  </span>
                </div>

                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (user.currentGoal.current /
                            Math.max(user.currentGoal.target, 1)) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-muted mt-2">
                  {Math.max(
                    user.currentGoal.target -
                      user.currentGoal.current,
                    0
                  )}{' '}
                  livros restantes
                </p>
              </div>
            )}

            {/* Sem usuários sugeridos enquanto não houver dados reais */}
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Leitores para seguir
              </h3>

              <div className="text-center py-4">
                <Users
                  size={28}
                  className="mx-auto text-zinc-700 mb-2"
                />

                <p className="text-xs text-zinc-500">
                  Nenhum leitor disponível ainda.
                </p>

                <p className="text-[11px] text-zinc-600 mt-1">
                  Novos leitores aparecerão aqui.
                </p>
              </div>
            </div>

          </div>
        </aside>

        {/* =========================
            MAIN FEED
        ========================= */}
        <main className="lg:col-span-6 space-y-6">

          {/* Tabs */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl border border-zinc-800"
            style={{
              background: 'var(--tab-bg, #18181B)',
            }}
          >
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === id
                    ? 'bg-green-600/20 text-green-300 border border-green-500/30'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon size={13} />

                <span className="hidden sm:block">
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Reviews */}
          {visibleReviews.length > 0 ? (
            <div className="space-y-4">
              {visibleReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review as any}
                />
              ))}
            </div>
          ) : (
            <div className="card-base p-10 text-center">
              <Rss
                size={36}
                className="mx-auto text-zinc-700 mb-3"
              />

              <h2 className="text-sm font-semibold text-foreground">
                Ainda não há atividades
              </h2>

              <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto">
                Quando os leitores começarem a usar o Projeto Tãmaras,
                suas avaliações e atividades aparecerão aqui.
              </p>
            </div>
          )}

          {/* Load more */}
          {visibleReviews.length > 0 && (
            <div className="text-center">
              <button className="btn-ghost text-sm px-6 py-2.5">
                Carregar mais
              </button>
            </div>
          )}
        </main>

        {/* =========================
            RIGHT SIDEBAR
        ========================= */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">

            {/* Trending books */}
            <div className="card-base p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp
                  size={14}
                  className="text-[#5E6E4E]"
                />

                <h3 className="text-sm font-semibold text-foreground">
                  Em Alta
                </h3>
              </div>

              {trendingBooks.length > 0 ? (
                <div className="space-y-3">
                  {trendingBooks.map((book, i) => {
                    const cover =
                      book.cover_url ||
                      book.cover ||
                      ''

                    return (
                      <div
                        key={book.id}
                        className="flex items-center gap-3 group cursor-pointer"
                      >
                        <span className="text-xs font-bold text-zinc-700 w-4">
                          {i + 1}
                        </span>

                        {cover ? (
                          <img
                            src={cover}
                            alt={book.title}
                            className="w-9 h-13 object-cover rounded shadow-md flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-13 rounded bg-zinc-800 flex-shrink-0" />
                        )}

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground group-hover:text-[#5E6E4E] transition-colors line-clamp-1">
                            {book.title}
                          </p>

                          <p className="text-xs text-muted">
                            {book.author}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-zinc-600 text-center py-4">
                  Nenhum livro disponível ainda.
                </p>
              )}
            </div>

            {/* Genres */}
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Gêneros Populares
              </h3>

              {popularGenres.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {popularGenres.map((genre) => (
                    <span
                      key={genre}
                      className="badge badge-primary text-xs cursor-pointer hover:bg-green-500/25 transition-all"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-600 text-center py-4">
                  Nenhum gênero disponível ainda.
                </p>
              )}
            </div>

          </div>
        </aside>
      </div>
    </div>
  )
}
