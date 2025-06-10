'use client'

import calculateBookingValues from '@/app/actions/booking/calculateBookingValues'
import { STATUS_ICONS, formatCurrency } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import { IconBrandWhatsappFilled } from '@tabler/icons-react'
import dayjs from 'dayjs'
import Link from 'next/link'
import MaterialSymbolsRealEstateAgent from '../icons/MaterialSymbolsRealEstateAgent'
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
      <CardDescription className="relative flex flex-col gap-1 text-xs">
        <div
          className="flex flex-row items-center gap-2 font-bold"
          title="Nome"
        >
          <MageUserSquareFill className={`w-4 h-4 `} />
          {booking?.guest.name}
        </div>
        <div
          className="flex flex-row items-center justify-between gap-2"
          title="Telefone"
        >
          <div className="flex flex-row items-center gap-2">
            <MageMobilePhoneFill className={`w-4 h-4 `} />
            {booking?.guest.phone}
          </div>
          <Link
            href={`https://wa.me/${booking?.guest.phone ? booking?.guest.phone.replace(/\D/g, '') : ''} `}
            target="_blank"
          >
            <IconBrandWhatsappFilled
              className={`w-4 h-4 hover:text-green-500`}
            />
            <span className="sr-only">Conversar no Whatsapp</span>
          </Link>
        </div>
        <div
          className="flex flex-row items-center gap-2"
          title="Data de entrada"
        >
          <MageCalendarUploadFill className={`w-4 h-4 `} />
          {dayjs(booking?.startDate).format('DD/MM/YYYY')}
        </div>
        <div className="flex flex-row items-center gap-2" title="Data de saída">
          <MageCalendarDownloadFill
            className={`w-4 h-4  ml-[1.95px] mr-[-1.95px]`}
          />
          {dayjs(booking?.endDate).format('DD/MM/YYYY')}
        </div>
        <div className="flex flex-row items-center gap-2" title="Valor total">
          <MageDollarFill className={`w-4 h-4 `} />
          {formatCurrency(calculateBookingValues(booking).totalAll)}
        </div>
        <div className="flex flex-row items-center gap-2" title="Valor pago">
          <MaterialSymbolsRealEstateAgent className={`w-4 h-4 `} />
          {formatCurrency(calculateBookingValues(booking).totalPayment)}
        </div>
      </CardDescription>
    </>
  )
}
