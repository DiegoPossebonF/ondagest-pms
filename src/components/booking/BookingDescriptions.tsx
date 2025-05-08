'use client'

import { getDifferenceInDays } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import dayjs from 'dayjs'
import {
  CalendarArrowDown,
  CalendarArrowUp,
  CircleUserRound,
  Smartphone,
} from 'lucide-react'
import { WhatsAppIcon } from '../icons/WhatsAppIcon'
import { CardDescription } from '../ui/card'

interface BookingDescriptionsProps {
  booking: BookingAllIncludes
}

export function BookingDescriptions({ booking }: BookingDescriptionsProps) {
  const daily = getDifferenceInDays({
    from: booking?.startDate,
    to: booking?.endDate,
  })

  return (
    <>
      <CardDescription className="flex flex-col gap-2 text-sm font-semibold">
        <div className="text-sm font-semibold flex flex-row items-center gap-4 ">
          <CircleUserRound size="16" className="text-blue-500" />
          {booking?.guest.name}
        </div>
        <div className="text-xs flex flex-row items-center gap-4 ">
          <Smartphone size="16" className="text-teal-700" />
          {booking?.guest.phone}
          <WhatsAppIcon color="green" className="w-4 h-4" />
        </div>
        <div className="flex flex-row items-center gap-4 text-xs">
          <CalendarArrowUp size="16" className="text-green-500" />
          {dayjs(booking?.startDate).format('DD/MM/YYYY')}
        </div>
        <div className="flex flex-row items-center gap-4 text-xs">
          <CalendarArrowDown size="16" className="text-red-500" />
          {dayjs(booking?.endDate).format('DD/MM/YYYY')}
        </div>
      </CardDescription>
    </>
  )
}
