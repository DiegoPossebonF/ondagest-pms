'use server'
import type { BookingStatus } from '@/app/generated/prisma'
import { updateBookingStatusIfNeeded } from '@/lib/actions/updateBookingStatusIfNeeded'
import db from '@/lib/db'
import { activeStatuses } from '@/lib/utils'

export async function getUnits() {
  try {
    const units = await db.unit.findMany({
      include: {
        type: true,
        bookings: {
          include: {
            guest: true,
            unit: {
              include: {
                type: {
                  include: {
                    rates: {
                      include: {
                        type: true,
                      },
                    },
                  },
                },
              },
            },
            payments: {
              orderBy: { paidAt: 'desc' },
            },
            services: true,
            discounts: true,
            rate: { include: { type: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return { units }
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getUnitsWithUpdatedBookings() {
  try {
    const units = await db.unit.findMany({
      include: {
        type: true,
        bookings: {
          where: { status: { in: activeStatuses as BookingStatus[] } },
          include: {
            guest: true,
            unit: {
              include: {
                type: {
                  include: {
                    rates: {
                      include: {
                        type: true,
                      },
                    },
                  },
                },
              },
            },
            payments: {
              orderBy: { paidAt: 'desc' },
            },
            services: true,
            discounts: true,
            rate: { include: { type: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    const updatedUnits = await Promise.all(
      units.map(async unit => {
        const updatedBookings = await Promise.all(
          unit.bookings.map(async booking => {
            return await updateBookingStatusIfNeeded(booking)
          })
        )

        return { ...unit, bookings: updatedBookings }
      })
    )

    return updatedUnits
  } catch (error) {
    console.log(error)
    return null
  }
}
