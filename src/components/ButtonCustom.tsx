import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from './ui/button'

interface ButtonCustomProps {
  className?: string
  text: string
  href: string
}

export default function ButtonCustom({
  className,
  text,
  href,
}: ButtonCustomProps) {
  return (
    <Link href={href} className="w-full">
      <Button
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-500 text-white hover:bg-blue-600',
          className
        )}
      >
        {text}
      </Button>
    </Link>
  )
}
