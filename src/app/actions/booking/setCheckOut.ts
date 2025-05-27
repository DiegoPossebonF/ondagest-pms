'use server'
import db from '@/lib/db'

export const setCheckOut = async (bookingId: number) => {
  const booking = await db.booking.update({
    where: { id: bookingId },
    data: { status: 'CHECKED_OUT' },
  })

  return booking
}
