import BookingsTable from '@/components/booking/BookingsTable'
import db from '@/lib/db'
import type { BookingAllIncludes } from '@/types/booking'

export default async function BookingsPage() {
  const bookings: BookingAllIncludes[] = await db.booking.findMany({
    orderBy: { startDate: 'asc' },
    include: {
      guest: true,
      unit: { include: { type: { include: { rates: true } } } },
      payments: true,
      services: true,
      discounts: true,
    },
  })

  return (
    <div className="p-6">
      <BookingsTable bookings={bookings} />
    </div>
  )
}
