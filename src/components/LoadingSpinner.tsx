import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({
  size = 'md',
  className,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-4',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-primary border-l-transparent border-r-transparent border-b-transparent',
        sizes[size],
        className
      )}
    />
  )
}
