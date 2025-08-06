'use server'
import db from '@/lib/db'
import type { BookingStatus } from '@prisma/client'

export const updateBookingStatus = async (
  bookingId: number,
  status: BookingStatus
) => {
  const booking = await db.booking.update({
    where: { id: bookingId },
    data: { status },
  })
  return booking
}
