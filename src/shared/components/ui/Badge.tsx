import { cn } from '../../utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'gold' | 'green' | 'red' | 'muted'
  className?: string
}

const variants = {
  primary: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  gold: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  green: 'bg-green-500/15 text-green-400 border-green-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
  muted: 'bg-zinc-800 text-zinc-400 border-zinc-700',
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
