import type { BookingStatus } from '@/app/generated/prisma'
import { BookingsList } from '@/components/booking/BookingsList'
import db from '@/lib/db'
import { activeStatuses } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'

export default async function BookingsPage() {
  const bookings: BookingAllIncludes[] = await db.booking.findMany({
    where: { status: { in: activeStatuses as BookingStatus[] } },
    include: {
      guest: true,
      unit: { include: { type: { include: { rates: true } } } },
      payments: true,
      services: true,
      discounts: true,
      rate: { include: { type: true } },
    },
    orderBy: { unit: { name: 'asc' } },
  })

  return (
    <div className="p-6">
      <BookingsList bookings={bookings} />
    </div>
  )
}
