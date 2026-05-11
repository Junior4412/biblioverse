import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, BookOpen, Heart, Bookmark, Share2, ChevronLeft, Clock, FileText, Check, Plus } from 'lucide-react'
import { MOCK_BOOKS, MOCK_REVIEWS } from '../shared/constants/mockData'
import { ReviewCard } from '../shared/components/ui/ReviewCard'
import { Badge } from '../shared/components/ui/Badge'
import { StarRating } from '../shared/components/ui/StarRating'
import { Button } from '../shared/components/ui/Button'
import toast from 'react-hot-toast'

const statusOptions = [
  { id: 'reading', label: 'Lendo', icon: BookOpen },
  { id: 'completed', label: 'Lido', icon: Check },
  { id: 'want-to-read', label: 'Quero ler', icon: Plus },
]

export function BookDetailsPage() {
  const { id } = useParams()
  const [readingStatus, setReadingStatus] = useState<string | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const book = MOCK_BOOKS.find((b) => b.id === id) || MOCK_BOOKS[0]
  const reviews = MOCK_REVIEWS.filter((r) => r.book.id === id || MOCK_REVIEWS.length)

  const handleStatusChange = (status: string) => {
    if (status === 'completed' && !showReviewForm) {
      setShowReviewForm(true)
      toast('Escreva uma review para finalizar o livro! ✍️', { icon: '📝' })
    }
    setReadingStatus(status)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (reviewRating === 0) {
      toast.error('Dê uma nota ao livro antes de publicar')
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Review publicada! 🎉')
    setShowReviewForm(false)
    setReviewText('')
    setReviewRating(0)
    setSubmitting(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link to="/books" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8 group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Voltar para livros
      </Link>

      {/* Book hero */}
      <div className="grid md:grid-cols-12 gap-8 mb-12">
        {/* Cover */}
        <div className="md:col-span-3">
          <div className="relative group">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full max-w-[240px] mx-auto md:mx-0 rounded-xl shadow-card object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/240x360/111113/7C3AED?text=${book.title[0]}`
              }}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Reading status buttons */}
          <div className="mt-4 space-y-2 max-w-[240px] mx-auto md:mx-0">
            {statusOptions.map(({ id: sId, label, icon: Icon }) => (
              <button
                key={sId}
                onClick={() => handleStatusChange(sId)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  readingStatus === sId
                    ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="md:col-span-9 space-y-5">
          <div>
            {book.trending && <Badge variant="gold" className="mb-3">🔥 Trending</Badge>}
            <h1 className="font-display font-black text-4xl text-foreground mb-2 leading-tight">{book.title}</h1>
            <p className="text-xl text-zinc-400 font-light">{book.author}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <StarRating rating={book.rating} size="lg" />
              <span className="font-bold text-2xl text-foreground">{book.rating}</span>
            </div>
            <span className="text-zinc-500 text-sm">({book.reviewCount.toLocaleString('pt-BR')} avaliações)</span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="primary">{book.genre}</Badge>
            {book.pages && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <FileText size={13} />
                {book.pages} páginas
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock size={13} />
              Publicado em {book.publishedAt}
            </div>
          </div>

          {/* Tags */}
          {book.tags && (
            <div className="flex flex-wrap gap-2">
              {book.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400">#{tag}</span>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="font-semibold text-foreground mb-2">Sinopse</h2>
            <p className="text-zinc-400 leading-relaxed">{book.description}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button className="p-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500/50 transition-all">
              <Heart size={18} />
            </button>
            <button className="p-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-violet-400 hover:border-violet-500/50 transition-all">
              <Bookmark size={18} />
            </button>
            <button className="p-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Write review section */}
      {(showReviewForm || readingStatus === 'completed') && (
        <div className="card-base p-6 mb-8 border-violet-500/30">
          <h2 className="font-display font-semibold text-xl text-foreground mb-4">
            {readingStatus === 'completed' ? '📝 Escreva sua review (obrigatório)' : 'Escrever Review'}
          </h2>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Sua nota</label>
              <StarRating rating={reviewRating} size="lg" interactive onChange={setReviewRating} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="O que você achou deste livro? Compartilhe sua experiência..."
                className="input-base resize-none h-32"
                required
                minLength={50}
              />
              <p className="text-xs text-zinc-600 mt-1">{reviewText.length}/50 caracteres mínimos</p>
            </div>
            <div className="flex gap-3">
              <Button type="submit" loading={submitting}>
                Publicar Review
              </Button>
              {!readingStatus && (
                <Button variant="ghost" type="button" onClick={() => setShowReviewForm(false)}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </div>
      )}

      {!showReviewForm && readingStatus !== 'completed' && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-2xl text-foreground">
            Reviews ({reviews.length})
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReviewForm(true)}
          >
            Escrever Review
          </Button>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.slice(0, 4).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
