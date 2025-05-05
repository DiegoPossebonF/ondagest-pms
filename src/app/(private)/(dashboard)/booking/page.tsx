import { BookingSheet } from '@/components/booking/BookingSheet'
import BookingsTable from '@/components/booking/BookingsTable'
import { Button } from '@/components/ui/button'
import db from '@/lib/db'
import type { BookingAllIncludes } from '@/types/booking'
import { Plus } from 'lucide-react'

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
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-700 bg-blue-200">
        <span className={`font-semibold transition-opacity`}>
          LISTA DE RESERVAS
        </span>
        <BookingSheet>
          <Button variant={'default'}>
            <Plus size={20} />
          </Button>
        </BookingSheet>
      </div>
      <div className="p-6">
        <BookingsTable bookings={bookings} />
      </div>
    </main>
  )
}
