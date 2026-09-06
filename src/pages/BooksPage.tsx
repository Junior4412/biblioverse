<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Grid, List, Search } from 'lucide-react'
import { BookCard } from '../shared/components/ui/BookCard'
import { supabase } from '../lib/supabase'
import type { Book } from '../shared/types'

const sortOptions = ['Relevância', 'Avaliação', 'Mais Reviews', 'Mais Recente', 'Título A-Z']

function toBook(row: Record<string, unknown>): Book {
  return {
    id: String(row.id),
    title: String(row.title ?? 'Título não informado'),
    author: String(row.author ?? 'Autor não informado'),
    cover: String(
      row.cover_url ??
      row.cover ??
      'https://via.placeholder.com/200x300/111113/7C3AED?text=Livro'
    ),
    genre: String(row.genre ?? row.category ?? 'Sem gênero'),
    description: String(row.description ?? ''),
    rating: Number(row.rating ?? row.average_rating ?? 0),
    reviewCount: Number(row.review_count ?? row.reviews_count ?? 0),
    publishedAt: Number(row.published_at ?? row.publication_year ?? 0),
    pages: Number(row.pages ?? row.page_count ?? 0),
    trending: Boolean(row.trending ?? false),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
  }
}

export function BooksPage() {
  const [searchParams] = useSearchParams()
  const [books, setBooks] = useState<Book[]>([])
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') ?? 'Todos')
  const [sort, setSort] = useState('Relevância')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadBooks() {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('books')
        .select('*')

      if (error) {
        setError(`Não foi possível carregar os livros: ${error.message}`)
        setLoading(false)
        return
      }

      setBooks((data ?? []).map((row) => toBook(row as Record<string, unknown>)))
      setLoading(false)
    }

    loadBooks()
  }, [])

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
    setSelectedGenre(searchParams.get('genre') ?? 'Todos')
  }, [searchParams])

  const genreOptions = useMemo(
    () => ['Todos', ...Array.from(new Set(books.map((book) => book.genre))).sort()],
    [books]
  )

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const result = books.filter((book) => {
      const matchQuery =
        !normalizedQuery ||
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.author.toLowerCase().includes(normalizedQuery) ||
        book.genre.toLowerCase().includes(normalizedQuery)

      const matchGenre =
        selectedGenre === 'Todos' || book.genre === selectedGenre

      return matchQuery && matchGenre
    })

    return [...result].sort((a, b) => {
      if (sort === 'Avaliação') return b.rating - a.rating
      if (sort === 'Mais Reviews') return b.reviewCount - a.reviewCount
      if (sort === 'Mais Recente') return b.publishedAt - a.publishedAt
      if (sort === 'Título A-Z') return a.title.localeCompare(b.title, 'pt-BR')
      return 0
    })
  }, [books, query, selectedGenre, sort])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-4xl text-foreground mb-2">
          Explorar Livros
        </h1>
        <p className="text-zinc-400">
          Descubra seu próximo livro favorito
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
=======
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Grid, List, Star, TrendingUp } from 'lucide-react'
import { BookCard } from '../shared/components/ui/BookCard'
import { Badge } from '../shared/components/ui/Badge'
import { MOCK_BOOKS, GENRES } from '../shared/constants/mockData'

const sortOptions = ['Relevância', 'Avaliação', 'Mais Reviews', 'Mais Recente', 'Título A-Z']
const genreOptions = ['Todos', ...GENRES.map((g) => g.name)]

export function BooksPage() {
  const [query, setQuery] = useState('')
  const [searchParams] = useSearchParams()
  const [selectedGenre, setSelectedGenre] = useState(() => {
    const g = searchParams.get('genre')
    return g && genreOptions.includes(g) ? g : 'Todos'
  })

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setQuery(q)
    const g = searchParams.get('genre')
    if (g && genreOptions.includes(g)) setSelectedGenre(g)
  }, [searchParams])
  const [sort, setSort] = useState('Relevância')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = MOCK_BOOKS.filter((b) => {
    const matchQuery = !query || b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase())
    const matchGenre = selectedGenre === 'Todos' || b.genre === selectedGenre
    return matchQuery && matchGenre
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-4xl text-foreground mb-2">Explorar Livros</h1>
        <p className="text-zinc-400">Descubra seu próximo livro favorito entre mais de 128 mil títulos</p>
      </div>

      {/* Search + filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
>>>>>>> origin/agent/supabase-auth
            placeholder="Buscar por título, autor ou gênero..."
            className="input-base pl-9"
          />
        </div>
<<<<<<< HEAD

        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="input-base w-auto"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded ${view === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
              aria-label="Visualização em grade"
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded ${view === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
              aria-label="Visualização em lista"
            >
=======
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-base w-auto"
          >
            {sortOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`p-2.5 rounded-lg border transition-all ${filtersOpen ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
          >
            <SlidersHorizontal size={16} />
          </button>
          <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>
              <Grid size={14} />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>
>>>>>>> origin/agent/supabase-auth
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

<<<<<<< HEAD
=======
      {/* Genre filters */}
>>>>>>> origin/agent/supabase-auth
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-8">
        {genreOptions.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              selectedGenre === genre
                ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                : 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

<<<<<<< HEAD
      {loading ? (
        <p className="text-zinc-400">Carregando livros...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-zinc-500">
              <span className="font-semibold text-foreground">{filtered.length}</span> livros encontrados
            </p>
            {selectedGenre !== 'Todos' && (
              <button
                onClick={() => setSelectedGenre('Todos')}
                className="text-xs text-violet-400 hover:text-violet-300"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((book) => <BookCard key={book.id} book={book} variant="horizontal" />)}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="font-semibold text-foreground mb-2">Nenhum livro encontrado</h3>
              <p className="text-zinc-500 text-sm">Tente uma busca diferente ou remova os filtros.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
=======
      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-zinc-500">
          <span className="font-semibold text-foreground">{filtered.length}</span> livros encontrados
        </p>
        {selectedGenre !== 'Todos' && (
          <button onClick={() => setSelectedGenre('Todos')} className="text-xs text-violet-400 hover:text-violet-300">
            Limpar filtros
          </button>
        )}
      </div>

      {/* Books grid */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} variant="horizontal" />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="font-semibold text-foreground mb-2">Nenhum livro encontrado</h3>
          <p className="text-zinc-500 text-sm">Tente uma busca diferente ou remova os filtros</p>
        </div>
      )}
    </div>
  )
}
>>>>>>> origin/agent/supabase-auth
