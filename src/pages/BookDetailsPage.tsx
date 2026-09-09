'tsx'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Review, Book } from '../shared/types'
import {
  BookOpen,
  Heart,
  Bookmark,
  Share2,
  ChevronLeft,
  Clock,
  FileText,
  Check,
  Plus,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
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

  const [book, setBook] = useState<Book | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const [readingStatus, setReadingStatus] = useState<string | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadBookAndReviews() {
      if (!id) {
        setLoading(false)
        return
      }

      setLoading(true)

      // =========================
      // CARREGA O LIVRO
      // =========================

      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('*, genres(name)')
        .eq('id', id)
        .single()

      if (bookError) {
        console.error('Erro ao carregar livro:', bookError)
        toast.error('Não foi possível carregar o livro.')
        setLoading(false)
        return
      }

      if (!bookData) {
        setLoading(false)
        return
      }

      const mappedBook: Book = {
        id: bookData.id,
        title: bookData.title ?? 'Sem título',
        author: bookData.author ?? 'Autor desconhecido',
        cover: bookData.cover_url ?? bookData.cover ?? '',
        description: bookData.description ?? 'Sem sinopse disponível.',
        genre: bookData.genres?.name ?? 'Sem gênero',
        pages: bookData.pages ?? 0,
        publishedAt: bookData.published_at
          ? new Date(bookData.published_at).getFullYear()
          : 0,
        rating: Number(bookData.rating ?? 0),
        reviewCount: Number(bookData.review_count ?? 0),
        trending: Boolean(bookData.trending),
        tags: Array.isArray(bookData.tags) ? bookData.tags : [],
      }

      setBook(mappedBook)

      // =========================
      // CARREGA AS REVIEWS
      // =========================

      const { data: reviewData, error: reviewError } = await supabase
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
          user:profiles!reviews_user_id_fkey (
            id,
            username,
            name,
            email,
            avatar_url
          )
        `)
        .eq('book_id', id)
        .order('created_at', { ascending: false })

      if (reviewError) {
        
        setReviews([])
      } else {
        const mappedReviews: Review[] = (reviewData ?? []).map(
          (item: any) => ({
            id: item.id,
            content: item.content ?? '',
            rating: Number(item.rating ?? 0),
            likes: Number(item.likes ?? 0),
            comments: Number(item.comments ?? 0),
            createdAt: item.created_at,
            liked: false,
            saved: false,

            user: {
              id: item.user?.id ?? item.user_id,
              username: item.user?.username ?? 'usuario',
              name: item.user?.name ?? 'Leitor',
              email: item.user?.email ?? '',
              avatar: item.user?.avatar_url ?? '',
              booksRead: 0,
              followers: 0,
              following: 0,
              createdAt: item.created_at,
            },

            book: mappedBook,
          }),
        )

        setReviews(mappedReviews)
      }

      setLoading(false)
    }

    loadBookAndReviews()
  }, [id])

  // =========================
  // ALTERA STATUS DE LEITURA
  // =========================

  const handleStatusChange = (status: string) => {
    if (status === 'completed' && !showReviewForm) {
      setShowReviewForm(true)

      toast('Escreva uma review para finalizar o livro! ✍️', {
        icon: '📝',
      })
    }

    setReadingStatus(status)
  }

  // =========================
  // PUBLICA REVIEW
  // =========================

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (reviewRating === 0) {
      toast.error('Dê uma nota ao livro antes de publicar')
      return
    }

    if (reviewText.trim().length < 50) {
      toast.error('Sua review precisa ter pelo menos 50 caracteres')
      return
    }

    if (!id) {
      toast.error('Livro não encontrado.')
      return
    }

    if (!book) {
      toast.error('Os dados do livro ainda não foram carregados.')
      return
    }

    setSubmitting(true)

    try {
      // =========================
      // PEGA USUÁRIO LOGADO
      // =========================

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error('Erro ao pegar usuário:', userError)
        toast.error('Não foi possível verificar sua conta.')
        return
      }

      if (!user) {
        toast.error('Você precisa estar logado para publicar uma review.')
        return
      }

      // =========================
      // SALVA A REVIEW NO SUPABASE
      // =========================

      const { error: insertError } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          book_id: id,
          content: reviewText.trim(),
          rating: reviewRating,
          likes: 0,
          comments: 0,
          is_spoiler: false,
        })

      if (insertError) {
    console.error('ERRO COMPLETO DA REVIEW:', {
  message: insertError.message,
  details: insertError.details,
  hint: insertError.hint,
  code: insertError.code,
})

        toast.error(
          insertError.message || 'Não foi possível publicar a review.',
        )

        return
      }

      // =========================
      // CRIA A REVIEW PARA MOSTRAR
      // IMEDIATAMENTE NA PÁGINA
      // =========================

      const mappedNewReview: Review = {
        id: crypto.randomUUID(),
        content: reviewText.trim(),
        rating: reviewRating,
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        liked: false,
        saved: false,

        user: {
          id: user.id,
          username: user.user_metadata?.username ?? 'usuario',
          name: user.user_metadata?.name ?? 'Leitor',
          email: user.email ?? '',
          avatar: user.user_metadata?.avatar_url ?? '',
          booksRead: 0,
          followers: 0,
          following: 0,
          createdAt: user.created_at,
        },

        book: {
          id: book.id,
          title: book.title,
          author: book.author,
          cover: book.cover,
          description: book.description,
          genre: book.genre,
          pages: book.pages,
          publishedAt: book.publishedAt,
          rating: book.rating,
          reviewCount: book.reviewCount,
          trending: book.trending,
          tags: book.tags,
        },
      }

      // Coloca a nova review no começo da lista
      setReviews((current) => [mappedNewReview, ...current])

      // =========================
      // FINALIZA
      // =========================

      toast.success('Review publicada! 🎉')

      setShowReviewForm(false)
      setReviewText('')
      setReviewRating(0)
    } catch (error) {
      console.error('Erro inesperado ao publicar review:', error)

      toast.error('Ocorreu um erro ao publicar a review.')
    } finally {
      setSubmitting(false)
    }
  }

  // =========================
  // CARREGANDO
  // =========================

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-zinc-400">Carregando livro...</p>
      </div>
    )
  }

  // =========================
  // LIVRO NÃO ENCONTRADO
  // =========================

  if (!book) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <Link
          to="/books"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300"
        >
          <ChevronLeft size={16} />
          Voltar para livros
        </Link>

        <div className="mt-10 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Livro não encontrado
          </h1>

          <p className="text-zinc-500 mt-2">
            Esse livro não foi encontrado no banco de dados.
          </p>
        </div>
      </div>
    )
  }

  // =========================
  // PÁGINA DO LIVRO
  // =========================

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/books"
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8 group"
      >
        <ChevronLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Voltar para livros
      </Link>

      <div className="grid md:grid-cols-12 gap-8 mb-12">
        {/* CAPA */}

        <div className="md:col-span-3">
          <div className="relative group">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full max-w-[240px] mx-auto md:mx-0 rounded-xl shadow-card object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  `https://via.placeholder.com/240x360/111113/7C3AED?text=${
                    book.title[0] || 'L'
                  }`
              }}
            />

            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* STATUS */}

          <div className="mt-4 space-y-2 max-w-[240px] mx-auto md:mx-0">
            {statusOptions.map(({ id: sId, label, icon: Icon }) => (
              <button
                key={sId}
                onClick={() => handleStatusChange(sId)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  readingStatus === sId
                    ? 'bg-green-600/20 border-green-500 text-green-300'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* INFORMAÇÕES DO LIVRO */}

        <div className="md:col-span-9 space-y-5">
          <div>
            {book.trending && (
              <Badge variant="gold" className="mb-3">
                🔥 Trending
              </Badge>
            )}

            <h1 className="font-display font-black text-4xl text-foreground mb-2 leading-tight">
              {book.title}
            </h1>

            <p className="text-xl text-zinc-400 font-light">
              {book.author}
            </p>
          </div>

          {/* NOTA */}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <StarRating rating={book.rating} size="lg" />

              <span className="font-bold text-2xl text-foreground">
                {book.rating.toFixed(1)}
              </span>
            </div>

            <span className="text-zinc-500 text-sm">
              ({book.reviewCount.toLocaleString('pt-BR')} avaliações)
            </span>
          </div>

          {/* INFORMAÇÕES */}

          <div className="flex flex-wrap gap-3">
            <Badge variant="primary">{book.genre}</Badge>

            {book.pages > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <FileText size={13} />
                {book.pages} páginas
              </div>
            )}

            {book.publishedAt > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Clock size={13} />
                Publicado em {book.publishedAt}
              </div>
            )}
          </div>

          {/* TAGS */}

          {book.tags && book.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {book.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* SINOPSE */}

          <div>
            <h2 className="font-semibold text-foreground mb-2">
              Sinopse
            </h2>

            <p className="text-zinc-400 leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* AÇÕES */}

          <div className="flex items-center gap-3 pt-2">
            <button className="p-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500/50 transition-all">
              <Heart size={18} />
            </button>

            <button className="p-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-[#5E6E4E] hover:border-green-500/50 transition-all">
              <Bookmark size={18} />
            </button>

            <button className="p-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* FORMULÁRIO DE REVIEW */}

      {(showReviewForm || readingStatus === 'completed') && (
        <div className="card-base p-6 mb-8 border-green-500/30">
          <h2 className="font-display font-semibold text-xl text-foreground mb-4">
            {readingStatus === 'completed'
              ? '📝 Escreva sua review (obrigatório)'
              : 'Escrever Review'}
          </h2>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Sua nota
              </label>

              <StarRating
                rating={reviewRating}
                size="lg"
                interactive
                onChange={setReviewRating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Review
              </label>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="O que você achou deste livro? Compartilhe sua experiência..."
                className="input-base resize-none h-32"
                required
                minLength={50}
              />

              <p className="text-xs text-zinc-600 mt-1">
                {reviewText.length}/50 caracteres mínimos
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" loading={submitting}>
                Publicar Review
              </Button>

              {!readingStatus && (
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* LISTA DE REVIEWS */}

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-semibold text-2xl text-foreground">
          Reviews ({reviews.length})
        </h2>

        {!showReviewForm && readingStatus !== 'completed' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReviewForm(true)}
          >
            Escrever Review
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {reviews.length === 0 && (
          <p className="text-zinc-500">
            Ainda não existem reviews para este livro.
          </p>
        )}

        {reviews.slice(0, 4).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}