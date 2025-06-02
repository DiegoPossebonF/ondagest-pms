import { BookingForm } from '@/components/booking/BookingForm'
import { BookingSummaryCard } from '@/components/booking/BookingSummaryCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import db from '@/lib/db'
import { STATUS_COLORS } from '@/lib/utils'

export default async function BookingId({
  params,
}: { params: { id: string } }) {
  const { id } = await params

  const booking = await db.booking.findUnique({
    where: { id: Number(id) },
    include: {
      guest: true,
      unit: { include: { type: { include: { rates: true } } } },
      payments: { orderBy: { paidAt: 'desc' } },
      discounts: { orderBy: { createdAt: 'desc' } },
      services: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!booking) {
    throw new Error('Reserva não encontrada')
  }

  return (
    <div className="p-6 overflow-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="md:basis-3/5">
          <Card className="overflow-hidden">
            <CardHeader
              className={`${booking && STATUS_COLORS[booking.status]}`}
            >
              <CardTitle>{`RES:${String(booking?.id).padStart(6, '0')} - ${booking?.status}`}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <BookingForm booking={booking ? booking : undefined} />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col md:basis-2/5 gap-4">
          <BookingSummaryCard booking={booking} />
        </div>
      </div>
    </div>
  )
}
