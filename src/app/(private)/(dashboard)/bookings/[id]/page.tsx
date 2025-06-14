import BookingForm from '@/components/booking/BookingForm'
import { BookingSummaryCard } from '@/components/booking/BookingSummaryCard'
import db from '@/lib/db'

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
          <BookingForm booking={booking} />
        </div>
        <div className="flex flex-col md:basis-2/5 gap-4">
          <BookingSummaryCard booking={booking} />
        </div>
      </div>
    </div>
  )
}
