'tsx'
import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Star,
  TrendingUp,
  Target,
  Flame,
  Award,
  Clock,
} from 'lucide-react'

import { useAuthStore } from '../store'
import { supabase } from '../lib/supabase'

interface UserBook {
  id: string
  book_id: string
  status: string
  started_at: string | null
  finished_at: string | null
  completed_at: string | null
  user_rating: number | null
  created_at: string
}

interface BookData {
  id: string
  title: string
  author: string
  cover_url?: string | null
  cover?: string | null
  rating?: number | null
  genre_id?: string | null
  genres?: {
    name: string
  } | null
}

interface ReviewData {
  id: string
  user_id: string
  book_id: string
  content: string
  rating: number
  created_at: string
  books?: BookData | null
}

interface GoalData {
  id: string
  user_id: string
  year: number
  target: number
  current: number
  created_at: string
}

interface BadgeData {
  id: string
  name: string
  icon: string
  description: string
  condition_type: string
  condition_value: number
}

interface UserBadgeData {
  user_id: string
  badge_id: string
  earned_at: string
  badges?: BadgeData | null
}

export function DashboardPage() {
  const { user } = useAuthStore()

  const [userBooks, setUserBooks] = useState<UserBook[]>([])
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [goal, setGoal] = useState<GoalData | null>(null)
  const [userBadges, setUserBadges] = useState<UserBadgeData[]>([])
  const [books, setBooks] = useState<BookData[]>([])
  const [loading, setLoading] = useState(true)

  // =========================
  // CARREGAR DADOS REAIS
  // =========================
  useEffect(() => {
    async function loadDashboard() {
      if (!user?.id) {
        setUserBooks([])
        setReviews([])
        setGoal(null)
        setUserBadges([])
        setBooks([])
        setLoading(false)
        return
      }

      setLoading(true)

      const [
        userBooksResult,
        reviewsResult,
        goalResult,
        badgesResult,
      ] = await Promise.all([
        supabase
          .from('user_books')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),

        supabase
          .from('reviews')
          .select(`
            id,
            user_id,
            book_id,
            content,
            rating,
            created_at,
            books (
              id,
              title,
              author,
              cover_url,
              cover,
              rating,
              genre_id,
              genres (
                name
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),

        supabase
          .from('reading_goals')
          .select('*')
          .eq('user_id', user.id)
          .order('year', { ascending: false })
          .limit(1)
          .maybeSingle(),

        supabase
          .from('user_badges')
          .select(`
            user_id,
            badge_id,
            earned_at,
            badges (
              id,
              name,
              icon,
              description,
              condition_type,
              condition_value
            )
          `)
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false }),
      ])

      if (userBooksResult.error) {
        console.error('Erro ao carregar livros do usuário:', userBooksResult.error)
      }

      if (reviewsResult.error) {
        console.error('Erro ao carregar reviews:', reviewsResult.error)
      }

      if (goalResult.error) {
        console.error('Erro ao carregar meta:', goalResult.error)
      }

      if (badgesResult.error) {
        console.error('Erro ao carregar badges:', badgesResult.error)
      }

      const loadedUserBooks = (userBooksResult.data ?? []) as UserBook[]
  const loadedReviews = (reviewsResult.data ?? []).map((review: any) => ({
  ...review,
  books: Array.isArray(review.books)
    ? review.books[0] ?? null
    : review.books ?? null,
})) as ReviewData[]

const loadedGoal = (goalResult.data ?? null) as GoalData | null

const loadedBadges = (badgesResult.data ?? []).map((badge: any) => ({
  ...badge,
  badges: Array.isArray(badge.badges)
    ? badge.badges[0] ?? null
    : badge.badges ?? null,
})) as UserBadgeData[]

      setUserBooks(loadedUserBooks)
      setReviews(loadedReviews)
      setGoal(loadedGoal)
      setUserBadges(loadedBadges)

      // Buscar os livros usados pelo usuário.
      const bookIds = [
        ...new Set([
          ...loadedUserBooks.map((item) => item.book_id),
          ...loadedReviews.map((item) => item.book_id),
        ]),
      ]

      if (bookIds.length > 0) {
        const { data: booksData, error: booksError } = await supabase
          .from('books')
          .select(`
            id,
            title,
            author,
            cover_url,
            cover,
            rating,
            genre_id,
            genres (
              name
            )
          `)
          .in('id', bookIds)

        if (booksError) {
          console.error('Erro ao carregar livros:', booksError)
        }

      const loadedBooks = (booksData ?? []).map((book: any) => ({
  ...book,
  genres: Array.isArray(book.genres)
    ? book.genres[0] ?? null
    : book.genres ?? null,
})) as BookData[]

setBooks(loadedBooks)
      } else {
        setBooks([])
      }

      setLoading(false)
    }

    loadDashboard()
  }, [user?.id])

  // =========================
  // LIVROS CONCLUÍDOS
  // =========================
  const completedBooks = useMemo(() => {
    return userBooks.filter(
      (book) =>
        book.status?.toLowerCase() === 'completed' ||
        book.status?.toLowerCase() === 'concluído' ||
        book.status?.toLowerCase() === 'concluido' ||
        Boolean(book.completed_at) ||
        Boolean(book.finished_at)
    )
  }, [userBooks])

  // =========================
  // STREAK
  // =========================
  const currentStreak = useMemo(() => {
    const dates = completedBooks
      .map((book) => book.completed_at || book.finished_at)
      .filter(Boolean)
      .map((date) => new Date(date as string).toISOString().split('T')[0])

    const uniqueDates = [...new Set(dates)].sort().reverse()

    if (uniqueDates.length === 0) return 0

    let streak = 1

    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i])
      const previous = new Date(uniqueDates[i + 1])

      const difference =
        (current.getTime() - previous.getTime()) /
        (1000 * 60 * 60 * 24)

      if (difference === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }, [completedBooks])

  // =========================
  // LIVROS POR MÊS
  // =========================
  const monthlyData = useMemo(() => {
    const currentYear = new Date().getFullYear()

    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ]

    return months.map((month, index) => {
      const count = completedBooks.filter((book) => {
        const date = book.completed_at || book.finished_at

        if (!date) return false

        const parsedDate = new Date(date)

        return (
          parsedDate.getFullYear() === currentYear &&
          parsedDate.getMonth() === index
        )
      }).length

      return {
        month,
        books: count,
      }
    })
  }, [completedBooks])

  const maxBooks = Math.max(
    ...monthlyData.map((item) => item.books),
    1
  )

  // =========================
  // GÊNEROS FAVORITOS
  // =========================
  const genreData = useMemo(() => {
    const genreCounts: Record<string, number> = {}

    completedBooks.forEach((userBook) => {
      const book = books.find((item) => item.id === userBook.book_id)
      const genreName = book?.genres?.name

      if (!genreName) return

      genreCounts[genreName] = (genreCounts[genreName] || 0) + 1
    })

    const total = Object.values(genreCounts).reduce(
      (sum, value) => sum + value,
      0
    )

    if (total === 0) return []

    return Object.entries(genreCounts)
      .map(([name, count]) => ({
        name,
        pct: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5)
  }, [completedBooks, books])

  // =========================
  // LIVROS RECENTES
  // =========================
  const recentBooks = useMemo(() => {
    return completedBooks
      .slice()
      .sort((a, b) => {
        const dateA = new Date(
          a.completed_at || a.finished_at || a.created_at
        ).getTime()

        const dateB = new Date(
          b.completed_at || b.finished_at || b.created_at
        ).getTime()

        return dateB - dateA
      })
      .slice(0, 4)
      .map((userBook) => {
        const book = books.find((item) => item.id === userBook.book_id)

        return {
          ...userBook,
          book,
        }
      })
      .filter((item) => item.book)
  }, [completedBooks, books])

  // =========================
  // META
  // =========================
  const goalPct = goal
    ? Math.min(
        100,
        Math.round((goal.current / Math.max(goal.target, 1)) * 100)
      )
    : 0

  const booksRemaining = goal
    ? Math.max(goal.target - goal.current, 0)
    : 0

  // =========================
  // RENDER
  // =========================
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="card-base p-10 text-center">
          <p className="text-zinc-400">Carregando seu Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-4xl text-foreground mb-2">
          Dashboard
        </h1>

        <p className="text-zinc-400">
          Acompanhe seu progresso de leitura e conquistas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: BookOpen,
            label: 'Livros Lidos',
            value: completedBooks.length,
            color: 'text-[#5E6E4E]',
            bg: 'bg-green-500/10',
          },
          {
            icon: Star,
            label: 'Reviews',
            value: reviews.length,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
          },
          {
            icon: Flame,
            label: 'Streak Atual',
            value: `${currentStreak} dias`,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
          },
          {
            icon: Award,
            label: 'Badges',
            value: userBadges.length,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card-base p-5">
            <div
              className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}
            >
              <Icon size={18} className={color} />
            </div>

            <p className="text-2xl font-bold text-foreground">
              {value}
            </p>

            <p className="text-sm text-zinc-500 mt-0.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Reading chart */}
        <div className="lg:col-span-2 card-base p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-foreground">
              Livros por Mês
            </h2>

            <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">
              {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex items-end gap-2 h-40">
            {monthlyData.map(({ month, books: count }) => (
              <div
                key={month}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-full flex items-end justify-center"
                  style={{ height: '120px' }}
                >
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-green-700 to-[#5E6E4E] transition-all"
                    style={{
                      height:
                        count > 0
                          ? `${(count / maxBooks) * 100}%`
                          : '4px',
                    }}
                    title={`${count} livros`}
                  />
                </div>

                <span className="text-[10px] text-zinc-600">
                  {month}
                </span>
              </div>
            ))}
          </div>

          {completedBooks.length === 0 && (
            <p className="text-center text-xs text-zinc-600 mt-4">
              Seus livros concluídos aparecerão aqui.
            </p>
          )}
        </div>

        {/* Goal */}
        <div className="card-base p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-[#5E6E4E]" />

            <h2 className="font-semibold text-foreground">
              Meta de Leitura
            </h2>
          </div>

          {goal ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 mb-4">
                <svg
                  viewBox="0 0 120 120"
                  className="w-full h-full -rotate-90"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#27272A"
                    strokeWidth="10"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#goalGrad)"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${
                      2 *
                      Math.PI *
                      50 *
                      (1 - goalPct / 100)
                    }`}
                    strokeLinecap="round"
                  />

                  <defs>
                    <linearGradient
                      id="goalGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">
                    {goalPct}%
                  </span>

                  <span className="text-xs text-zinc-500">
                    concluído
                  </span>
                </div>
              </div>

              <p className="text-sm text-zinc-400 text-center">
                <span className="text-foreground font-semibold">
                  {goal.current}
                </span>{' '}
                de{' '}
                <span className="text-foreground font-semibold">
                  {goal.target}
                </span>{' '}
                livros em {goal.year}
              </p>

              <p className="text-xs text-zinc-600 mt-2 text-center">
                {booksRemaining > 0
                  ? `Faltam ${booksRemaining} livros para bater a meta!`
                  : 'Meta concluída!'}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Target
                size={36}
                className="text-zinc-700 mb-3"
              />

              <p className="text-sm text-zinc-500">
                Nenhuma meta de leitura definida.
              </p>

              <p className="text-xs text-zinc-600 mt-1">
                Crie uma meta para acompanhar seu progresso.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Genres */}
        <div className="card-base p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#5E6E4E]" />
            Gêneros Favoritos
          </h2>

          {genreData.length > 0 ? (
            <div className="space-y-3">
              {genreData.map(({ name, pct }) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">
                      {name}
                    </span>

                    <span className="text-zinc-500">
                      {pct}%
                    </span>
                  </div>

                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-600 to-[#5E6E4E] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp
                size={30}
                className="mx-auto text-zinc-700 mb-3"
              />

              <p className="text-sm text-zinc-500">
                Ainda não há dados suficientes.
              </p>

              <p className="text-xs text-zinc-600 mt-1">
                Seus gêneros favoritos aparecerão conforme você ler livros.
              </p>
            </div>
          )}
        </div>

        {/* Recent books */}
        <div className="card-base p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock size={16} className="text-[#5E6E4E]" />
            Lidos Recentemente
          </h2>

          {recentBooks.length > 0 ? (
            <div className="space-y-3">
              {recentBooks.map((item) => {
                const book = item.book as BookData

                const cover =
                  book.cover_url ||
                  book.cover ||
                  ''

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3"
                  >
                    {cover ? (
                      <img
                        src={cover}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-14 rounded bg-zinc-800 flex items-center justify-center">
                        <BookOpen
                          size={16}
                          className="text-zinc-600"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {book.title}
                      </p>

                      <p className="text-xs text-zinc-500 truncate">
                        {book.author}
                      </p>

                      {book.rating !== null &&
                        book.rating !== undefined && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star
                              size={10}
                              className="text-amber-400 fill-amber-400"
                            />

                            <span className="text-xs text-zinc-500">
                              {book.rating}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen
                size={30}
                className="mx-auto text-zinc-700 mb-3"
              />

              <p className="text-sm text-zinc-500">
                Nenhum livro concluído ainda.
              </p>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="card-base p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award size={16} className="text-[#5E6E4E]" />
            Conquistas
          </h2>

          {userBadges.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {userBadges.map((item) => {
                const badge = item.badges

                if (!badge) return null

                return (
                  <div
                    key={item.badge_id}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-green-500/10 border border-[#5E6E4E]/20"
                    title={badge.description}
                  >
                    <span className="text-xl">
                      {badge.icon}
                    </span>

                    <span className="text-[10px] text-zinc-400 text-center leading-tight">
                      {badge.name}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award
                size={30}
                className="mx-auto text-zinc-700 mb-3"
              />

              <p className="text-sm text-zinc-500">
                Nenhuma conquista ainda.
              </p>

              <p className="text-xs text-zinc-600 mt-1">
                Suas conquistas aparecerão conforme você usar o Biblioverse.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent reviews */}
      <div className="card-base p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Star size={16} className="text-[#5E6E4E]" />
          Minhas Reviews Recentes
        </h2>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.slice(0, 3).map((review) => {
              const book = review.books

              if (!book) return null

              const cover =
                book.cover_url ||
                book.cover ||
                ''

              return (
                <div
                  key={review.id}
                  className="flex gap-4 p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/60"
                >
                  {cover ? (
                    <img
                      src={cover}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-16 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <BookOpen
                        size={18}
                        className="text-zinc-600"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">
                      {book.title}
                    </p>

                    <div className="flex gap-0.5 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < review.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-700'
                          }
                        />
                      ))}
                    </div>

                    <p className="text-sm text-zinc-400 line-clamp-2">
                      {review.content}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star
              size={30}
              className="mx-auto text-zinc-700 mb-3"
            />

            <p className="text-sm text-zinc-500">
              Você ainda não escreveu nenhuma review.
            </p>

            <p className="text-xs text-zinc-600 mt-1">
              Suas reviews aparecerão aqui quando você escrever uma.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
