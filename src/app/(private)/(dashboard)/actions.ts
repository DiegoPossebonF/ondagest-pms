'use server'
import { updateBookingStatusIfNeeded } from '@/lib/actions/updateBookingStatusIfNeeded'
import db from '@/lib/db'

export async function getUnitsWithUpdatedBookings() {
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
}

export async function getUnits() {
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
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  if (!units) {
    throw new Error('Erro ao buscar Unidades')
  }

  return units
}

export async function getServices() {
  const services = await db.service.findMany({
    distinct: ['name'],
    orderBy: { createdAt: 'desc' },
  })

  if (!services) {
    return []
  }

  return services
}
