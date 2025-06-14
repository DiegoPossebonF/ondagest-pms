import { cn } from '@/lib/utils'
import { IconLoader } from '@tabler/icons-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({
  size = 'md',
  className,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <div
      className={cn(
        'w-full h-full flex items-center justify-center',
        className
      )}
    >
      <IconLoader
        className={cn('animate-spin duration-[1000ms]', sizes[size], className)}
      />
    </div>
  )
}
