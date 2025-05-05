'use client'
import {
  STATUS_COLORS,
  STATUS_PAYMENT_COLORS,
  getDifferenceInDays,
} from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import type { UnitWithTypeAndBookings } from '@/types/unit'
import dayjs from 'dayjs'
import { CircleDollarSign, Forward, House, Plus, User2 } from 'lucide-react'
import Link from 'next/link'
import { BookingDescriptions } from '../booking/BookingDescriptions'
import { BookingSheet } from '../booking/BookingSheet'
import { PaymentSheet } from '../payment/PaymentSheet'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'

interface UnitCardProps {
  className?: string
  unit: UnitWithTypeAndBookings
  booking?: BookingAllIncludes
}

export default function UnitCard({ unit, booking }: UnitCardProps) {
  const daily = getDifferenceInDays({
    from: booking?.startDate,
    to: booking?.endDate,
  })

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader
        className={`p-6 pb-2 border-grey-200 border-b-[5px] rounded-t-xl ${booking ? STATUS_COLORS[booking.status] : ''}`}
      >
        <CardTitle className="text-white font-bold">{unit.name}</CardTitle>
        <CardDescription className="text-white font">
          {unit.type.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 border-grey-200 ">
        {booking ? (
          <BookingDescriptions booking={booking} />
        ) : (
          <CardDescription className="flex flex-col justify-around gap-2 text-sm font-semibold text-center">
            Livre
          </CardDescription>
        )}
      </CardContent>
      <CardFooter
        className={`${booking ? 'p-4' : 'p-[12px]'} bg-orange-100 rounded-b-xl flex flex-row justify-center items-center gap-4 border-t-[5px]`}
      >
        {booking ? (
          <>
            <PaymentSheet booking={booking}>
              <CircleDollarSign
                className={`h-6 w-6 ${STATUS_PAYMENT_COLORS[booking.paymentStatus]} cursor-pointer`}
              />
            </PaymentSheet>
            <Link href={`/booking/${booking?.id}`}>
              <Forward className="h-6 w-6 text-zinc-400" />
            </Link>
            <Link href={`/units/$unit?.id`}>
              <User2 className="h-6 w-6 text-zinc-400" />
            </Link>
            <Link href={`/units/$unit?.id`}>
              <House className="h-6 w-6 text-zinc-400" />
            </Link>
          </>
        ) : (
          <BookingSheet startDate={dayjs()} unit={unit}>
            <Button variant={'default'} size={'sm'}>
              <Plus />
              Hospedar
            </Button>
          </BookingSheet>
        )}
      </CardFooter>
    </Card>
  )
}
