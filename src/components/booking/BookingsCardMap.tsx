'use client'
import type { BookingAllIncludes } from '@/types/booking'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

dayjs.locale('pt-br')

import { STATUS_COLORS } from '@/lib/utils'
import Link from 'next/link'
import { WhatsAppIcon } from '../icons/WhatsAppIcon'

interface BookingsCardMapProps {
  booking: BookingAllIncludes
  positionLeft: string
  widthCard: string
  startIcon: boolean
  endIcon: boolean
  startDiagonal: boolean
  endDiagonal: boolean
}

export function BookingsCardMap({
  booking,
  positionLeft,
  widthCard,
  startIcon,
  endIcon,
  startDiagonal,
  endDiagonal,
}: BookingsCardMapProps) {
  const daily = dayjs(booking.endDate).diff(dayjs(booking.startDate), 'day')
  const phone = booking?.guest?.phone?.replace(/\D/g, '')

  return (
    <DropdownMenu key={booking.id}>
      <DropdownMenuTrigger
        className={`absolute`}
        style={{
          left: positionLeft,
          width: widthCard,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <div
          className={`relative transition-transform duration-500 hover:scale-105 ${startDiagonal && endDiagonal ? 'clip-fixed' : startDiagonal ? 'clip-left' : endDiagonal ? 'clip-right' : ''} h-6 rounded-md text-center text-white flex items-center justify-between shadow-sm ${STATUS_COLORS[booking.status]} ${startIcon ? '' : 'rounded-l-[0px]'} ${endIcon ? '' : 'rounded-r-[0px]'}`}
        >
          <div
            className={`absolute left-0 top-0 h-full w-7 clip-right ${startDiagonal ? 'bg-emerald-500' : ''} z-10`}
          />
          <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis z-0 px-7 text-xs font-semibold text-gray-800 text-foreground">
            {booking.guest.name}
          </div>
          <div
            className={`absolute right-0 top-0 h-full w-7 clip-left ${endDiagonal ? 'bg-orange-700' : ''} z-10`}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-transparent border-none shadow-none p-4">
        <Card className="z-10 overflow-auto shadow-md">
          <CardHeader
            className={`p-4 text-white z-0 ${STATUS_COLORS[booking.status]}`}
          >
            <CardTitle>{`RES:${String(booking.id).padStart(6, '0')} - ${booking.unit.name} | ${booking.status}`}</CardTitle>
          </CardHeader>
          <CardContent className="bg-gray-100 p-4 flex flex-col gap-2 text-sm">
            <CardDescription className="text-sm font-semibold">
              {booking.guest.name}
              <div className="text-xs font-light flex flex-row items-center gap-2 ">
                {booking.guest.phone}
                {phone && (
                  <Link href={`https://wa.me/55${phone}`} target="_blank">
                    <WhatsAppIcon className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </CardDescription>
            <CardDescription className="font-light flex flex-col">
              <div className="flex flex-row items-center gap-2 text-xs">
                <p className="text-xs font-semibold">Check-in:</p>
                {dayjs(booking.startDate).format('DD/MM/YYYY')}
              </div>
              <div className="flex flex-row items-center gap-2 text-xs">
                <p className="text-xs font-semibold">Check-out:</p>
                {dayjs(booking.endDate).format('DD/MM/YYYY')}
              </div>
              <div className="flex flex-row items-center gap-2 text-xs">
                <p className="text-xs font-semibold">Nº de Pessoas:</p>
                {booking.numberOfPeople}
              </div>
            </CardDescription>
            <CardDescription className="font-light flex flex-col">
              <div className="flex flex-row items-center gap-2 text-xs">
                <p className="text-xs font-semibold">Diárias:</p>
                {daily}
              </div>
              <div className="flex flex-row items-center gap-2 text-xs">
                <p className="text-xs font-semibold">Valor da diária:</p>
                {`R$ ${booking.totalAmount / daily}`}
              </div>
              <div className="flex flex-row items-center gap-2 text-xs">
                <p className="text-xs font-semibold">Valor total:</p>
                {`R$ ${booking.totalAmount}`}
              </div>
            </CardDescription>
            <CardDescription className="font-light flex flex-col">
              <div className="flex flex-row items-center gap-2 text-xs">
                <p className="text-xs font-semibold">Pagamento:</p>
                {'?'}
              </div>
            </CardDescription>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
