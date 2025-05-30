'use server'
import type { BookingStatus } from '@/app/generated/prisma'
import db from '@/lib/db'

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
