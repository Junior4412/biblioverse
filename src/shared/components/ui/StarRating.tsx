import { Star } from 'lucide-react'
import { cn } from '../../utils'

interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

export function StarRating({
  rating,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const sizes = { sm: 12, md: 16, lg: 20 }
  const px = sizes[size]

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(rating)
        return (
          <Star
            key={i}
            size={px}
            className={cn(
              'transition-colors',
              filled ? 'text-amber-400 fill-amber-400' : 'text-zinc-700 fill-zinc-700',
              interactive && 'cursor-pointer hover:text-amber-300 hover:fill-amber-300'
            )}
            onClick={() => interactive && onChange?.(i + 1)}
          />
        )
      })}
    </div>
  )
}
