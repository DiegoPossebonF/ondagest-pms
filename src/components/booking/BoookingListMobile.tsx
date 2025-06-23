import {
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_PAYMENT_COLORS,
  STATUS_PAYMENT_LABELS,
  formatCurrency,
} from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import dayjs from 'dayjs'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface BookingsListMobileProps {
  bookings: BookingAllIncludes[]
}

export function BookingsListMobile({ bookings }: BookingsListMobileProps) {
  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <Card key={booking.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{booking.guest.name}</CardTitle>
            <Badge className={`${STATUS_COLORS[booking.status]}`}>
              {STATUS_LABELS[booking.status]}
            </Badge>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div>Acomodação: {booking.unit.name}</div>
            <div>
              Período: {dayjs(booking.startDate).format('DD/MM')} -{' '}
              {dayjs(booking.endDate).format('DD/MM')}
            </div>
            <div>Pessoas: {booking.numberOfPeople}</div>
            <div>
              Pagamento:
              <Badge
                className={`ml-2 ${STATUS_PAYMENT_COLORS[booking.paymentStatus]}`}
              >
                {STATUS_PAYMENT_LABELS[booking.paymentStatus]}
              </Badge>
            </div>
            <div>Total: {formatCurrency(booking.totalAmount)}</div>
            <div className="pt-2">
              <Link
                href={`/bookings/${booking.id}`}
                title="Detalhes da reserva"
              >
                <Button size="sm" variant="outline">
                  Detalhes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
