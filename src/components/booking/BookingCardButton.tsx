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
      className={cn('p-1 m-0 h-auto', className)}
      {...props}
    >
      {children}
    </Button>
  )
})

BookingCardButton.displayName = 'BookingCardButton'

export { BookingCardButton }
