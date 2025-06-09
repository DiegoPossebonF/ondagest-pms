'use client'
import type { BookingAllIncludes } from '@/types/booking'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')
import {
  STATUS_COLORS_TEXT,
  STATUS_COLORS_TEXT_ONLY_HOVER,
  STATUS_ICONS,
  STATUS_LABELS,
} from '@/lib/utils'
import Link from 'next/link'
import { BookingDescriptions } from '../booking/BookingDescriptions'
import { Button } from '../ui/button'
import { CardDescription } from '../ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface UnitBookingCardViewProps {
  booking: BookingAllIncludes
  positionLeft: string
  widthCard: string
  startIcon: boolean
  endIcon: boolean
  startDiagonal: boolean
  endDiagonal: boolean
}

export function UnitBookingCardView({
  booking,
  positionLeft,
  widthCard,
  startIcon,
  endIcon,
  startDiagonal,
  endDiagonal,
}: UnitBookingCardViewProps) {
  const IconStatus = STATUS_ICONS[booking.status]
  return (
    <div
      key={booking.id}
      className="absolute cursor-pointer"
      style={{
        left: positionLeft,
        width: widthCard,
        top: '50%',
        transform: 'translateY(-50%)',
      }}
    >
      <Popover key={booking.id}>
        <PopoverTrigger asChild>
          <Button
            className={`w-full bg-secondary-foreground px-0 hover:bg-secondary-foreground/90 dark:bg-sidebar-foreground dark:hover:bg-sidebar-foreground/90 text-primary-foreground relative border-2 border-sidebar-foreground transition-transform duration-500 ${startDiagonal && endDiagonal ? 'clip-fixed' : startDiagonal ? 'clip-left' : endDiagonal ? 'clip-right' : ''} h-6 rounded-md text-center flex items-center justify-between shadow-sm ${startIcon ? '' : 'rounded-l-[0px]'} ${endIcon ? '' : 'rounded-r-[0px]'}`}
          >
            <div
              className={`absolute left-0 top-0 h-full clip-right ${startDiagonal ? 'bg-teal-400 w-7' : ''} z-10`}
            />
            <div
              className={`flex flex-row items-center justify-start gap-2 px-2 w-full ${STATUS_COLORS_TEXT_ONLY_HOVER[booking.status]} text-primary-foreground overflow-hidden whitespace-nowrap text-ellipsis z-0 text-xs`}
            >
              <IconStatus
                className={`w-4 h-4 ${startDiagonal ? 'ml-6' : ''}`}
              />
              <p>{booking.guest.name}</p>
            </div>
            <div
              className={`absolute right-0 top-0 h-full clip-left ${endDiagonal ? 'bg-red-400 w-7' : ''} z-10`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`flex flex-col gap-4 w-60`}>
          <BookingDescriptions booking={booking} />
          <CardDescription
            className={`flex flex-row gap-2 text-xs ${STATUS_COLORS_TEXT[booking.status]}`}
          >
            <IconStatus className="w-4 h-4" />
            <p>{STATUS_LABELS[booking.status]}</p>
          </CardDescription>
          <Link href={`/bookings/${booking.id}`} className="w-full">
            <Button variant={'secondary'} size="sm" className="w-full">
              <IconStatus className="w-4 h-4" />
              {'Ir para reserva'}
            </Button>
          </Link>
        </PopoverContent>
      </Popover>
    </div>
  )
}
