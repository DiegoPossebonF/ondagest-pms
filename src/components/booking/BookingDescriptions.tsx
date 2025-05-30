'use client'

import { STATUS_COLORS_TEXT, STATUS_ICONS, STATUS_LABELS } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import dayjs from 'dayjs'
import { CircleUserRound, Smartphone } from 'lucide-react'
import { WhatsAppIcon } from '../icons/WhatsAppIcon'
import MageCalendarDownloadFill from '../icons/mage/MageCalendarDownloadFill'
import MageCalendarUploadFill from '../icons/mage/MageCalendarUploadFill'
import { CardDescription } from '../ui/card'

interface BookingDescriptionsProps {
  booking: BookingAllIncludes
}

export function BookingDescriptions({ booking }: BookingDescriptionsProps) {
  const StatusIcon = STATUS_ICONS[booking.status]

  return (
    <>
      <CardDescription className="flex flex-col gap-2 text-sm font-semibold">
        <div className="text-sm font-semibold flex flex-row items-center gap-4 ">
          <CircleUserRound
            className={`w-5 h-5 ${STATUS_COLORS_TEXT[booking.status]}`}
          />
          {booking?.guest.name}
        </div>
        <div className="text-xs flex flex-row items-center gap-4 ">
          <Smartphone
            className={`w-5 h-5 ${STATUS_COLORS_TEXT[booking.status]}`}
          />
          {booking?.guest.phone}
          <WhatsAppIcon color="green" className="w-4 h-4" />
        </div>
        <div className="flex flex-row items-center gap-4 text-xs">
          <MageCalendarUploadFill
            className={`w-5 h-5 ${STATUS_COLORS_TEXT[booking.status]}`}
          />
          {dayjs(booking?.startDate).format('DD/MM/YYYY')}
        </div>
        <div className="flex flex-row items-center gap-4 text-xs">
          <MageCalendarDownloadFill
            className={`w-5 h-5 ${STATUS_COLORS_TEXT[booking.status]} ml-[1.95px] mr-[-1.95px]`}
          />
          {dayjs(booking?.endDate).format('DD/MM/YYYY')}
        </div>
      </CardDescription>
      <CardDescription className="flex flex-col gap-2 text-sm font-semibold mt-4">
        <div className="text-sm font-semibold flex flex-row items-center gap-4 ">
          <StatusIcon
            className={`${STATUS_COLORS_TEXT[booking.status]} w-5 h-5`}
          />
          {STATUS_LABELS[booking.status]}
        </div>
      </CardDescription>
    </>
  )
}
