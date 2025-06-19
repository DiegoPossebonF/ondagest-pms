'use server'

import type { BookingStatus } from '@/app/generated/prisma'
import db from '@/lib/db'
import { activeStatuses } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'

export async function getBookingsPerPeriod(period: { from: Date; to: Date }) {
  try {
    const bookings: BookingAllIncludes[] = await db.booking.findMany({
      where: {
        status: { in: activeStatuses as BookingStatus[] },
        OR: [
          {
            AND: [
              { startDate: { gte: period.from } },
              { startDate: { lte: period.to } },
            ],
          },
          {
            AND: [
              { endDate: { gte: period.from } },
              { endDate: { lte: period.to } },
            ],
          },
          {
            AND: [
              { startDate: { lte: period.from } },
              { endDate: { gte: period.to } },
            ],
          },
        ],
      },
      include: {
        unit: { include: { type: { include: { rates: true } } } },
        guest: true,
        payments: true,
        services: true,
        discounts: true,
        rate: { include: { type: true } },
      },
      orderBy: {
        startDate: 'asc',
      },
    })

    return { bookings }
  } catch (error) {
    console.log(error)
    return null
  }
}
