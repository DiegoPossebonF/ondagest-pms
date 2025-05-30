import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'

type BookingCardButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const BookingCardButton = React.forwardRef<
  HTMLButtonElement,
  BookingCardButtonProps
>(({ className, children, ...props }, ref) => {
  return (
    <Button
      variant={'default'}
      className={cn(
        'px-2 py-1 m-0 h-auto flex items-center justify-center',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
})

BookingCardButton.displayName = 'BookingCardButton'

export { BookingCardButton }
