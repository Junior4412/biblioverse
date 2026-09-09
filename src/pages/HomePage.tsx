import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Grid,
  MapPin,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { BookCard } from '../shared/components/ui/BookCard'
import { supabase } from '../lib/supabase'
import type { Book } from '../shared/types'

function toBook(row: Record<string, unknown>): Book {
  const genreData = row.genres as { name?: unknown } | null

  return {
    id: String(row.id),
    title: String(row.title ?? 'Título não informado'),
    author: String(row.author ?? 'Autor não informado'),
    cover: String(
      row.cover_url ??
        row.cover ??
        'https://via.placeholder.com/200x300/111113/7C3AED?text=Livro'
    ),
    genre: String(genreData?.name ?? 'Sem gênero'),
    description: String(row.description ?? ''),
    rating: Number(row.rating ?? row.average_rating ?? 0),
    reviewCount: Number(row.review_count ?? row.reviews_count ?? 0),
    publishedAt: Number(row.published_at ?? row.publication_year ?? 0),
    pages: Number(row.pages ?? row.page_count ?? 0),
    trending: Boolean(row.trending ?? false),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
  }
}

export function HomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadBooks() {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('books')
        .select('*, genres(name)')

      if (error) {
        console.error('Erro ao carregar livros:', error)
        setError('Não foi possível carregar os livros.')
        setLoading(false)
        return
      }

      setBooks(
        (data ?? []).map((row) =>
          toBook(row as Record<string, unknown>)
        )
      )

      setLoading(false)
    }

    loadBooks()
  }, [])

  const trendingBooks = useMemo(() => {
    const trending = books
      .filter((book) => book.trending)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)

    if (trending.length > 0) {
      return trending
    }

    return [...books]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
  }, [books])

  const genres = useMemo(() => {
    const genreMap = new Map<string, number>()

    books.forEach((book) => {
      if (book.genre && book.genre !== 'Sem gênero') {
        genreMap.set(
          book.genre,
          (genreMap.get(book.genre) ?? 0) + 1
        )
      }
    })

    return Array.from(genreMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
      .map(([name, count]) => ({
        name,
        count,
      }))
  }, [books])

  const totalReviews = useMemo(
    () =>
      books.reduce(
        (total, book) => total + (Number.isFinite(book.reviewCount) ? book.reviewCount : 0),
        0
      ),
    [books]
  )

  const averageRating = useMemo(() => {
    const ratedBooks = books.filter((book) => book.rating > 0)

    if (ratedBooks.length === 0) {
      return 0
    }

    return (
      ratedBooks.reduce((total, book) => total + book.rating, 0) /
      ratedBooks.length
    )
  }, [books])

  const genreIcons = [
    '📚',
    '❤️',
    '🚀',
    '👻',
    '🔎',
    '🐉',
    '💭',
    '💼',
    '💻',
    '🏛️',
    '🎨',
    '📖',
    '✨',
    '🌎',
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-green-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-green-800/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-0 w-[350px] h-[350px] bg-green-500/6 rounded-full blur-[80px]" />
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light border border-[#5E6E4E]/20 text-sm animate-fade-in">
            <Sparkles size={14} className="text-[#5E6E4E]" />
            <span className="text-zinc-400">
              A plataforma social para leitores
            </span>
          </div>

          <div
            className="space-y-4 animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl leading-none tracking-tight">
              <span className="text-foreground">Seu universo</span>
              <br />
              <span className="text-gradient">literário</span>
              <br />
              <span className="text-foreground">começa aqui</span>
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
              Descubra novos livros, acompanhe suas leituras e explore
              histórias que podem se tornar suas próximas favoritas.
            </p>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <Link to="/register">
              <button className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 group">
                Começar gratuitamente
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>

            <Link to="/books">
              <button className="btn-ghost text-base px-8 py-3.5 flex items-center gap-2">
                <BookOpen size={18} />
                Explorar livros
              </button>
            </Link>
          </div>

          {/* Dados reais */}
          {!loading && !error && (
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-zinc-500 animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#5E6E4E]" />
                <span>
                  {books.length.toLocaleString('pt-BR')} livros no catálogo
                </span>
              </div>

              {averageRating > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star
                    size={14}
                    className="text-amber-400 fill-amber-400"
                  />
                  <span>
                    {averageRating.toFixed(1)}/5 de avaliação média
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-[#5E6E4E] rounded-full" />
          </div>
        </div>
      </section>

      {/* Informações reais */}
      {!loading && !error && (
        <section className="relative py-20 border-y border-zinc-800/60 bg-zinc-950/50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="font-display font-black text-4xl text-gradient mb-2">
                  {books.length.toLocaleString('pt-BR')}
                </div>
                <div className="text-sm text-zinc-500">
                  livros disponíveis
                </div>
              </div>

              <div className="text-center">
                <div className="font-display font-black text-4xl text-gradient mb-2">
                  {genres.length}
                </div>
                <div className="text-sm text-zinc-500">
                  gêneros encontrados
                </div>
              </div>

              <div className="text-center col-span-2 md:col-span-1">
                <div className="font-display font-black text-4xl text-gradient mb-2">
                  {totalReviews.toLocaleString('pt-BR')}
                </div>
                <div className="text-sm text-zinc-500">
                  avaliações registradas
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Livros em destaque */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-[#5E6E4E]" />
                <span className="text-xs font-medium text-[#5E6E4E] uppercase tracking-widest">
                  Seleção do catálogo
                </span>
              </div>

              <h2 className="font-display font-bold text-3xl text-foreground">
                Livros em Destaque
              </h2>
            </div>

            <Link
              to="/books"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-[#5E6E4E] transition-colors group"
            >
              Ver todos
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {loading ? (
            <p className="text-center text-zinc-500 py-12">
              Carregando livros...
            </p>
          ) : error ? (
            <p className="text-center text-red-400 py-12">
              {error}
            </p>
          ) : trendingBooks.length === 0 ? (
            <p className="text-center text-zinc-500 py-12">
              Nenhum livro disponível no catálogo.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {trendingBooks.map((book, i) => (
                <div
                  key={book.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <BookCard book={book} variant="default" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-zinc-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap size={16} className="text-[#5E6E4E]" />
              <span className="text-xs font-medium text-[#5E6E4E] uppercase tracking-widest">
                Funcionalidades
              </span>
            </div>

            <h2 className="font-display font-bold text-4xl text-foreground mb-4">
              Tudo que um leitor precisa
            </h2>

            <p className="text-zinc-500 max-w-xl mx-auto">
              Explore livros, organize suas descobertas e encontre novos
              conteúdos para sua jornada literária.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '📚',
                title: 'Catálogo de livros',
                desc: 'Explore os livros disponíveis no catálogo do Biblioverse.',
              },
              {
                icon: '⭐',
                title: 'Avaliações',
                desc: 'Consulte as avaliações disponíveis para os livros do catálogo.',
              },
              {
                icon: '🔎',
                title: 'Busca',
                desc: 'Encontre livros por título, autor ou gênero.',
              },
              {
                icon: '🏷️',
                title: 'Gêneros',
                desc: 'Explore o catálogo separado por diferentes gêneros literários.',
              },
              {
                icon: '📖',
                title: 'Descoberta',
                desc: 'Encontre novos livros para adicionar à sua lista de leitura.',
              },
              {
                icon: '👥',
                title: 'Comunidade',
                desc: 'Conecte-se com outros leitores e compartilhe sua experiência.',
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="card-base p-6 group"
              >
                <div className="text-3xl mb-4">{icon}</div>

                <h3 className="font-semibold text-foreground mb-2 group-hover:text-green-300 transition-colors">
                  {title}
                </h3>

                <p className="text-sm text-zinc-500 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gêneros reais */}
      {!loading && !error && genres.length > 0 && (
        <section className="py-24 px-6 bg-zinc-950/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-3xl text-foreground mb-3">
                Explore por Gênero
              </h2>

              <p className="text-zinc-500">
                Encontre livros dentro dos gêneros disponíveis no catálogo
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {genres.map(({ name, count }, index) => (
                <Link
                  key={name}
                  to={`/genres?g=${encodeURIComponent(name)}`}
                >
                  <div className="card-base p-4 text-center group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-lg mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform">
                      {genreIcons[index % genreIcons.length]}
                    </div>

                    <p className="text-xs font-medium text-foreground leading-tight line-clamp-2">
                      {name}
                    </p>

                    <p className="text-xs text-zinc-600 mt-0.5">
                      {count.toLocaleString('pt-BR')} livros
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bibliotecas */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="card-base overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-transparent z-0" />

            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(94,110,78,0.25),_transparent_60%)]" />
            </div>

            <div className="relative z-20 p-10 md:p-16 max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-[#5E6E4E]" />
                <span className="text-xs font-medium text-[#5E6E4E] uppercase tracking-widest">
                  Bibliotecas
                </span>
              </div>

              <h2 className="font-display font-bold text-3xl text-foreground mb-4">
                Descubra Bibliotecas Próximas
              </h2>

              <p className="text-zinc-400 mb-6 leading-relaxed">
                Encontre bibliotecas e espaços de leitura cadastrados no
                Biblioverse.
              </p>

              <Link to="/libraries">
                <button className="btn-primary flex items-center gap-2">
                  <MapPin size={16} />
                  Ver bibliotecas
                </button>
              </Link>
            </div>

            <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-3">
              <div className="glass border border-zinc-700 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5E6E4E]/20 flex items-center justify-center">
                  <MapPin size={14} className="text-[#5E6E4E]" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Encontre uma biblioteca
                  </p>

                  <div className="flex items-center gap-1">
                    <span className="text-xs text-zinc-500">
                      Consulte o mapa completo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-radial from-green-900/20 via-transparent to-transparent" />

        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="font-display font-black text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            Pronto para explorar
            <br />
            <span className="text-gradient">seu próximo livro?</span>
          </h2>

          <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
            Explore o catálogo e descubra novas histórias.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <button className="btn-primary text-base px-10 py-4 flex items-center gap-2 group shadow-glow">
                Criar conta grátis
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>

            <Link to="/books">
              <button className="btn-ghost text-base px-8 py-4">
                Explorar sem cadastro
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}