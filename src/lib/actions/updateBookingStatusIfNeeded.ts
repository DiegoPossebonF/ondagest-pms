import type { BookingAllIncludes } from '@/types/booking'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import db from '../db'

dayjs.extend(isSameOrBefore)

export async function updateBookingStatusIfNeeded(
  booking: BookingAllIncludes
): Promise<BookingAllIncludes> {
  const today = dayjs()
  let newStatus = booking.status

  if (
    booking.status === 'CONFIRMED' &&
    dayjs(booking.startDate).isSameOrBefore(today, 'day')
  ) {
    newStatus = 'CHECKED_IN'
  } else if (
    booking.status === 'IN_PROGRESS' &&
    dayjs(booking.endDate).isSameOrBefore(today, 'day')
  ) {
    newStatus = 'CHECKED_OUT'
  }

  if (newStatus !== booking.status) {
    await db.booking.update({
      where: { id: booking.id },
      data: { status: newStatus },
    })

    // Opcional: retornar já com o status atualizado
    return { ...booking, status: newStatus }
  }

  return booking
}
