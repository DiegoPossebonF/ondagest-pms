import db from '@/lib/db'
import type { BookingAllIncludes } from '@/types/booking'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

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
  } else if (
    booking.status === 'CHECKED_OUT' &&
    dayjs(booking.endDate).isAfter(today, 'day')
  ) {
    newStatus = 'IN_PROGRESS'
  }

  if (newStatus !== booking.status) {
    const bookingStatusUpdated = await db.booking.update({
      where: { id: booking.id },
      data: { status: newStatus },
      include: {
        guest: true,
        unit: {
          include: {
            type: { include: { rates: { include: { type: true } } } },
          },
        },
        payments: true,
        services: true,
        discounts: true,
        rate: { include: { type: true } },
      },
    })

    // Opcional: retornar já com o status atualizado
    return { ...bookingStatusUpdated }
  }

  return booking
}
