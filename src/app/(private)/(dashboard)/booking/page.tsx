import { BookingCardButton } from '@/components/booking/BookingCardButton'
import { BookingSheet } from '@/components/booking/BookingSheet'
import BookingsTable from '@/components/booking/BookingsTable'
import MageCalendarPlusFill from '@/components/icons/mage/MageCalendarPlusFill'
import db from '@/lib/db'
import type { BookingAllIncludes } from '@/types/booking'

export default async function BookingPage() {
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
    <main>
      <div className="flex items-center justify-between px-8 py-[18.08px] border-b border-gray-700 bg-blue-200">
        <span className={`font-semibold transition-opacity`}>
          LISTA DE RESERVAS
        </span>
        <BookingSheet>
          <BookingCardButton>
            <MageCalendarPlusFill className="w-6 h-6" />
          </BookingCardButton>
        </BookingSheet>
      </div>
      <div className="p-6">
        <BookingsTable bookings={bookings} />
      </div>
    </main>
  )
}
