'use client'

import calculateBookingValues from '@/app/actions/booking/calculateBookingValues'
import {
  STATUS_COLORS_TEXT,
  STATUS_ICONS,
  STATUS_LABELS,
  formatCurrency,
} from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import dayjs from 'dayjs'
import MaterialSymbolsRealEstateAgent from '../icons/MaterialSymbolsRealEstateAgent'
import { WhatsAppIcon } from '../icons/WhatsAppIcon'
import MageCalendarDownloadFill from '../icons/mage/MageCalendarDownloadFill'
import MageCalendarUploadFill from '../icons/mage/MageCalendarUploadFill'
import MageDollarFill from '../icons/mage/MageDollarFill'
import MageMobilePhoneFill from '../icons/mage/MageMobilePhoneFill'
import MageUserSquareFill from '../icons/mage/MageUserSquareFill'
import { CardDescription } from '../ui/card'

interface BookingDescriptionsProps {
  booking: BookingAllIncludes
}

export function BookingDescriptions({ booking }: BookingDescriptionsProps) {
  const StatusIcon = STATUS_ICONS[booking.status]

  return (
    <>
      <CardDescription className="flex flex-col gap-1 text-xs">
        <div
          className="flex flex-row items-center gap-2 font-bold"
          title="Nome"
        >
          <MageUserSquareFill
            className={`w-4 h-4 ${STATUS_COLORS_TEXT[booking.status]}`}
          />
          {booking?.guest.name}
        </div>
        <div className="flex flex-row items-center gap-2" title="Telefone">
          <MageMobilePhoneFill
            className={`w-4 h-4 ${STATUS_COLORS_TEXT[booking.status]}`}
          />
          {booking?.guest.phone}
          <WhatsAppIcon color="green" className="w-4 h-4" />
        </div>
        <div
          className="flex flex-row items-center gap-2"
          title="Data de entrada"
        >
          <MageCalendarUploadFill
            className={`w-4 h-4 ${STATUS_COLORS_TEXT[booking.status]}`}
          />
          {dayjs(booking?.startDate).format('DD/MM/YYYY')}
        </div>
        <div className="flex flex-row items-center gap-2" title="Data de saída">
          <MageCalendarDownloadFill
            className={`w-4 h-4 ${STATUS_COLORS_TEXT[booking.status]} ml-[1.95px] mr-[-1.95px]`}
          />
          {dayjs(booking?.endDate).format('DD/MM/YYYY')}
        </div>
        <div className="flex flex-row items-center gap-2" title="Valor total">
          <MageDollarFill
            className={`w-4 h-4 ${STATUS_COLORS_TEXT[booking.status]}`}
          />
          {formatCurrency(calculateBookingValues(booking).totalAll)}
        </div>
        <div className="flex flex-row items-center gap-2" title="Valor pago">
          <MaterialSymbolsRealEstateAgent
            className={`w-4 h-4 ${STATUS_COLORS_TEXT[booking.status]}`}
          />
          {formatCurrency(calculateBookingValues(booking).totalPayment)}
        </div>
      </CardDescription>
      <CardDescription className="flex flex-col gap-2 mt-4 text-xs">
        <div
          className="flex flex-row items-center gap-2"
          title="Status da reserva"
        >
          <StatusIcon
            className={`${STATUS_COLORS_TEXT[booking.status]} w-4 h-4`}
          />
          {STATUS_LABELS[booking.status]}
        </div>
      </CardDescription>
    </>
  )
}
