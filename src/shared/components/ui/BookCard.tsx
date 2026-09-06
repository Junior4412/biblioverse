import { Star, BookOpen, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Book } from '../../types'
import { Badge } from './Badge'
import { cn } from '../../utils'

interface BookCardProps {
  book: Book
  variant?: 'default' | 'compact' | 'horizontal'
  className?: string
}

export function BookCard({ book, variant = 'default', className }: BookCardProps) {
  if (variant === 'horizontal') {
    return (
      <Link to={`/books/${book.id}`}>
        <div className={cn('card-base p-4 flex gap-4 group cursor-pointer', className)}>
          <div className="relative flex-shrink-0">
            <img
              src={book.cover}
              alt={book.title}
              className="w-16 h-24 object-cover rounded-md shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/64x96/111113/7C3AED?text=${encodeURIComponent(book.title[0])}`
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-accent transition-colors line-clamp-1">
              {book.title}
            </h3>
            <p className="text-xs text-muted mt-0.5">{book.author}</p>
            <div className="flex items-center gap-1 mt-2">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-foreground">{book.rating}</span>
              <span className="text-xs text-muted">({book.reviewCount.toLocaleString('pt-BR')})</span>
            </div>
            <Badge variant="primary" className="mt-2 text-xs">{book.genre}</Badge>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link to={`/books/${book.id}`}>
        <div className={cn('group cursor-pointer', className)}>
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x300/111113/7C3AED?text=${encodeURIComponent(book.title[0])}`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <div>
                <p className="text-xs font-semibold text-white line-clamp-2">{book.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs text-amber-400">{book.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/books/${book.id}`}>
      <div className={cn('card-base overflow-hidden group cursor-pointer', className)}>
        <div className="relative overflow-hidden">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x300/111113/7C3AED?text=${encodeURIComponent(book.title[0])}`
            }}
          />
          {book.trending && (
            <div className="absolute top-2 left-2">
              <Badge variant="gold">🔥 Trending</Badge>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>
        <div className="p-3">
          <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-accent transition-colors line-clamp-1">
            {book.title}
          </h3>
          <p className="text-xs text-muted mt-0.5 line-clamp-1">{book.author}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium">{book.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted">
              <BookOpen size={10} />
              <span className="text-xs">{book.reviewCount.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
