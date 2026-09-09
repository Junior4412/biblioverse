'tsx'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Genre {
  id: string
  name: string
}

interface Book {
  id: string
  title: string
  author: string
  cover_url?: string | null
  cover?: string | null
  genre_id?: string | null
  genres?: {
    name: string
  } | null
}

export function GenresPage() {
  const navigate = useNavigate()

  const [genres, setGenres] = useState<Genre[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadGenres() {
      setLoading(true)

      // =========================
      // GÊNEROS REAIS
      // =========================
      const { data: genresData, error: genresError } = await supabase
        .from('genres')
        .select('id, name')
        .order('name', { ascending: true })

      if (genresError) {
        console.error('Erro ao carregar gêneros:', genresError)
      }

      setGenres(genresData ?? [])

      // =========================
      // LIVROS REAIS
      // =========================
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select(`
          id,
          title,
          author,
          cover_url,
          cover,
          genre_id,
          genres (
            name
          )
        `)
        .order('title', { ascending: true })

      if (booksError) {
        console.error('Erro ao carregar livros:', booksError)
      }

      const formattedBooks = (booksData ?? []).map((book: any) => ({
        ...book,
        genres: Array.isArray(book.genres)
          ? book.genres[0] ?? null
          : book.genres ?? null,
      })) as Book[]

      setBooks(formattedBooks)

      setLoading(false)
    }

    loadGenres()
  }, [])

  // =========================
  // CONTAGEM REAL POR GÊNERO
  // =========================
  function getGenreBooks(genre: Genre) {
    return books.filter((book) => {
      if (book.genre_id === genre.id) return true

      return book.genres?.name === genre.name
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="card-base p-10 text-center">
          <p className="text-zinc-400">
            Carregando gêneros...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* =========================
          HEADER
      ========================= */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-4xl text-foreground mb-2">
          Gêneros
        </h1>

        <p className="text-zinc-400">
          Explore livros por categoria e encontre seu próximo favorito
        </p>
      </div>

      {/* =========================
          LISTA DE GÊNEROS
      ========================= */}
      {genres.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre) => {
            const genreBooks = getGenreBooks(genre)

            return (
              <button
                key={genre.id}
                onClick={() =>
                  navigate(
                    `/books?genre=${encodeURIComponent(genre.name)}`
                  )
                }
                className="group card-base p-6 flex flex-col items-center gap-3 text-center cursor-pointer hover:scale-105 transition-transform"
              >
                {/* Ícone */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-700/30 to-green-400/10 border border-green-500/20 flex items-center justify-center text-2xl shadow-lg">
                  📚
                </div>

                <div>
                  <p className="font-semibold text-foreground text-sm group-hover:text-green-300 transition-colors">
                    {genre.name}
                  </p>

                  <p className="text-xs text-zinc-500 mt-0.5 flex items-center justify-center gap-1">
                    <BookOpen size={10} />
                    {genreBooks.length.toLocaleString('pt-BR')} livros
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="card-base p-10 text-center">
          <BookOpen
            size={40}
            className="mx-auto text-zinc-700 mb-3"
          />

          <p className="text-zinc-400">
            Nenhum gênero cadastrado ainda.
          </p>
        </div>
      )}

      {/* =========================
          DESTAQUES POR GÊNERO
      ========================= */}
      <div className="mt-12">
        <h2 className="font-display font-bold text-2xl text-foreground mb-6">
          Destaques por Gênero
        </h2>

        <div className="space-y-8">
          {genres.slice(0, 4).map((genre) => {
            const genreBooks = getGenreBooks(genre).slice(0, 4)

            if (!genreBooks.length) return null

            return (
              <div key={genre.id}>

                {/* Título do gênero */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">
                    📚
                  </span>

                  <h3 className="font-semibold text-foreground">
                    {genre.name}
                  </h3>

                  <button
                    onClick={() =>
                      navigate(
                        `/books?genre=${encodeURIComponent(
                          genre.name
                        )}`
                      )
                    }
                    className="ml-auto text-xs text-[#5E6E4E] hover:text-green-300"
                  >
                    Ver todos →
                  </button>
                </div>

                {/* Livros */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {genreBooks.map((book) => {
                    const cover =
                      book.cover_url ||
                      book.cover ||
                      ''

                    return (
                      <button
                        key={book.id}
                        onClick={() =>
                          navigate(`/books/${book.id}`)
                        }
                        className="group card-base p-3 text-left"
                      >
                        {cover ? (
                          <img
                            src={cover}
                            alt={book.title}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                        ) : (
                          <div className="w-full h-40 bg-zinc-800 rounded-lg mb-3 flex items-center justify-center">
                            <BookOpen
                              size={30}
                              className="text-zinc-600"
                            />
                          </div>
                        )}

                        <p className="text-sm font-medium text-foreground group-hover:text-green-300 transition-colors line-clamp-1">
                          {book.title}
                        </p>

                        <p className="text-xs text-zinc-500 mt-0.5">
                          {book.author}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
