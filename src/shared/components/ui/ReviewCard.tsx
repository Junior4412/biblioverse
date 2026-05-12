import { useState } from 'react'
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Review } from '../../types'
import { Avatar } from './Avatar'
import { StarRating } from './StarRating'
import { formatDate, formatNumber } from '../../utils'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [liked, setLiked] = useState(review.liked || false)
  const [saved, setSaved] = useState(review.saved || false)
  const [likeCount, setLikeCount] = useState(review.likes)
  const [expanded, setExpanded] = useState(false)

  const isLong = review.content.length > 200

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <article className="card-base p-5 space-y-4 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${review.user.username}`}>
            <Avatar src={review.user.avatar} name={review.user.name} size="md" />
          </Link>
          <div>
            <Link
              to={`/profile/${review.user.username}`}
              className="font-semibold text-sm text-foreground hover:text-accent transition-colors"
            >
              {review.user.name}
            </Link>
            <p className="text-xs text-muted">@{review.user.username} · {formatDate(review.createdAt)}</p>
          </div>
        </div>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Book reference */}
      <Link to={`/books/${review.book.id}`}>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 dark:bg-zinc-900/60 hover:border-zinc-700 transition-colors">
          <img
            src={review.book.cover}
            alt={review.book.title}
            className="w-10 h-14 object-cover rounded shadow-md flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://via.placeholder.com/40x56/111113/7C3AED?text=${review.book.title[0]}`
            }}
          />
          <div className="min-w-0">
            <p className="font-display font-semibold text-sm text-foreground line-clamp-1">{review.book.title}</p>
            <p className="text-xs text-muted">{review.book.author}</p>
            <StarRating rating={review.rating} size="sm" className="mt-1" />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div>
        <p className="text-sm text-zinc-300 leading-relaxed">
          {isLong && !expanded ? review.content.slice(0, 200) + '...' : review.content}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-violet-400 hover:text-violet-300 mt-1 transition-colors"
          >
            {expanded ? 'Ver menos' : 'Ver mais'}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              liked
                ? 'text-red-400 bg-red-500/10'
                : 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10'
            }`}
          >
            <Heart size={13} className={liked ? 'fill-red-400' : ''} />
            {formatNumber(likeCount)}
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
            <MessageCircle size={13} />
            {formatNumber(review.comments)}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSaved(!saved)}
            className={`p-1.5 rounded-lg transition-all ${
              saved ? 'text-violet-400' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <Bookmark size={13} className={saved ? 'fill-violet-400' : ''} />
          </button>
          <button className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-400 transition-all">
            <Share2 size={13} />
          </button>
        </div>
      </div>
    </article>
  )
}
