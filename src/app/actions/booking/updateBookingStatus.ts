'use server'

import type { BookingStatus } from '@prisma/client'
import dbWithTenant from '../utils/dbWithTenant'

export const updateBookingStatus = async (
  bookingId: number,
  status: BookingStatus
) => {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  const booking = await db.booking.update({
    where: { id: bookingId },
    data: { status },
  })
  return booking
}
