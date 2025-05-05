'use client'

import { cn } from '@/lib/utils' // Função utilitária para combinar classes
import { Button } from '../ui/button'

interface LogoutButtonProps {
  className?: string
  text: string
  action: () => void
}

export default function SignoutButton({ className, text, action }: LogoutButtonProps) {
  return (
    <Button
      onClick={action}
      className={cn(
        'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-500 text-white hover:bg-red-600',
        className
      )}
    >
      {text}
    </Button>
  )
}
