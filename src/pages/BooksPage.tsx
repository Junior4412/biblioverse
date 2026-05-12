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
            placeholder="Buscar por título, autor ou gênero..."
            className="input-base pl-9"
          />
        </div>
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
            className={`p-2.5 rounded-lg border transition-all ${filtersOpen ? 'border-violet-500 bg-violet-500/10 text-violet-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
          >
            <SlidersHorizontal size={16} />
          </button>
          <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>
              <Grid size={14} />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Genre filters */}
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
