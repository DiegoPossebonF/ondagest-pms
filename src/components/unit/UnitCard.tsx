'use client'
import calculateBookingValues from '@/app/actions/booking/calculateBookingValues'
import { setCheckOut } from '@/app/actions/booking/setCheckOut'
import { BookingStatus } from '@/app/generated/prisma'
import { useToast } from '@/hooks/use-toast'
import { STATUS_COLORS, STATUS_PAYMENT_COLORS } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import type { UnitWithTypeAndBookings } from '@/types/unit'
import dayjs from 'dayjs'
import { Forward, Plus } from 'lucide-react'
import Link from 'next/link'
import { BookingDescriptions } from '../booking/BookingDescriptions'
import { BookingSheet } from '../booking/BookingSheet'
import FluentDoorArrowRight28Filled from '../icons/FluentDoorArrowRight28Filled'
import HugeiconsPayment01 from '../icons/HugeiconsPayment01'
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
}

function getRelevantBooking(
  bookings: BookingAllIncludes[]
): { overdue?: BookingAllIncludes; booking?: BookingAllIncludes } | null {
  const today = new Date()

  const validStatuses: BookingStatus[] = [
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
    BookingStatus.CHECKED_IN,
    BookingStatus.IN_PROGRESS,
  ]

  // 🔴 Primeiro, procurar reservas que deveriam ter terminado mas não fizeram check-out
  const overdue = bookings.find(
    booking =>
      (booking.status === BookingStatus.PENDING ||
        booking.status === BookingStatus.CONFIRMED ||
        booking.status === BookingStatus.CHECKED_IN ||
        booking.status === BookingStatus.IN_PROGRESS) &&
      new Date(booking.endDate) < today
  )

  if (overdue) {
    return {
      overdue,
      booking: undefined,
    }
  }

  // ✅ Se não há overdue, segue fluxo padrão: reservas ativas que ainda não terminaram
  const filtered = bookings.filter(
    booking =>
      validStatuses.includes(booking.status) &&
      new Date(booking.endDate) >= today
  )

  if (filtered.length === 0) return null

  // Ordena pela data de início ascendente
  filtered.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )

  return {
    overdue: undefined,
    booking: filtered[0],
  }
}

export default function UnitCard({ unit }: UnitCardProps) {
  const { toast } = useToast()
  const relevantBooking = getRelevantBooking(unit.bookings)

  const booking = relevantBooking?.booking || relevantBooking?.overdue
  const overdue = !!relevantBooking?.overdue

  const canCheckOut = (booking: BookingAllIncludes): boolean => {
    const { totalAll, totalPayment } = calculateBookingValues(booking)
    // Só pode fazer check-out se já pagou tudo
    return totalPayment >= totalAll
  }

  const handleCheckOut = async (booking: BookingAllIncludes) => {
    canCheckOut(booking)
      ? await setCheckOut(booking.id)
      : toast({
          variant: 'destructive',
          title: 'Pagamento pendente',
          description: `Ainda faltam ${calculateBookingValues(booking).totalAll - calculateBookingValues(booking).totalPayment} para concluir o check-out.`,
        })
  }

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader
        className={`p-6 pb-2 border-grey-200 border-b-[5px] rounded-t-xl ${booking ? (overdue ? 'bg-purple-600' : STATUS_COLORS[booking.status]) : 'bg-gray-900'}`}
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
              <HugeiconsPayment01
                className={`h-6 w-6 ${STATUS_PAYMENT_COLORS[booking.paymentStatus]} cursor-pointer`}
              />
            </PaymentSheet>
            <Link href={`/booking/${booking?.id}`}>
              <Forward className="h-6 w-6 text-zinc-400" />
            </Link>
            {overdue && (
              <Link
                href={'#'}
                title="Fazer check-out"
                onClick={() => handleCheckOut(booking)}
              >
                <FluentDoorArrowRight28Filled className="h-6 w-6 text-purple-600" />
              </Link>
            )}
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
