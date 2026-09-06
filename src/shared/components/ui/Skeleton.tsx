import { cn } from '../../utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-gradient-to-r from-zinc-800/80 via-zinc-700/40 to-zinc-800/80 bg-[length:200%_100%] animate-shimmer',
        className
      )}
    />
  )
}

export function BookCardSkeleton() {
  return (
    <div className="card-base p-4 space-y-3">
      <Skeleton className="w-full aspect-[2/3] rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  )
}

export function ReviewCardSkeleton() {
  return (
    <div className="card-base p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
}
