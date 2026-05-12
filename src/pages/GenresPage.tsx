import { useNavigate } from 'react-router-dom'
import { GENRES, MOCK_BOOKS } from '../shared/constants/mockData'
import { BookOpen } from 'lucide-react'

export function GenresPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-4xl text-foreground mb-2">Gêneros</h1>
        <p className="text-zinc-400">Explore livros por categoria e encontre seu próximo favorito</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {GENRES.map((genre) => (
          <button
            key={genre.name}
            onClick={() => navigate(`/books?genre=${encodeURIComponent(genre.name)}`)}
            className="group card-base p-6 flex flex-col items-center gap-3 text-center cursor-pointer hover:scale-105 transition-transform"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${genre.color} flex items-center justify-center text-2xl shadow-lg`}>
              {genre.icon}
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm group-hover:text-violet-300 transition-colors">{genre.name}</p>
              <p className="text-xs text-zinc-500 mt-0.5 flex items-center justify-center gap-1">
                <BookOpen size={10} /> {genre.count.toLocaleString('pt-BR')} livros
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Popular per genre */}
      <div className="mt-12">
        <h2 className="font-display font-bold text-2xl text-foreground mb-6">Destaques por Gênero</h2>
        <div className="space-y-8">
          {GENRES.slice(0, 4).map((genre) => {
            const books = MOCK_BOOKS.filter((b) => b.genre === genre.name).slice(0, 4)
            if (!books.length) return null
            return (
              <div key={genre.name}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">{genre.icon}</span>
                  <h3 className="font-semibold text-foreground">{genre.name}</h3>
                  <button
                    onClick={() => navigate(`/books?genre=${encodeURIComponent(genre.name)}`)}
                    className="ml-auto text-xs text-violet-400 hover:text-violet-300"
                  >
                    Ver todos →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {books.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => navigate(`/books/${book.id}`)}
                      className="group card-base p-3 text-left"
                    >
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <p className="text-sm font-medium text-foreground group-hover:text-violet-300 transition-colors line-clamp-1">{book.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{book.author}</p>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
