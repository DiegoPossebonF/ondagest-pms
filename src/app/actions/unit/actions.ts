'use server'
import { updateBookingStatusIfNeeded } from '@/lib/actions/updateBookingStatusIfNeeded'
import db from '@/lib/db'
import { activeBookingStatuses } from '@/lib/db/scopes'

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

    return { data: units }
  } catch (error) {
    console.log('Erro ao buscar acomodações (getUnits)', error)
    return {
      data: null,
      error:
        'Erro ao buscar acomodações - tente novamente ou contate o suporte!',
    }
  }
}

export async function getUnitById(id: string) {
  try {
    const unit = await db.unit.findUnique({
      where: { id },
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
    })

    return unit
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function freeUnitsPerPeriod(
  period: { from: Date; to: Date },
  ignoreBookingId?: number
) {
  try {
    const units = await db.unit.findMany({
      where: {
        NOT: {
          bookings: {
            some: {
              ...activeBookingStatuses,
              AND: [
                {
                  OR: [
                    {
                      startDate: { lte: period.from },
                      endDate: { gte: period.from },
                    },
                    {
                      startDate: { lte: period.to },
                      endDate: { gte: period.to },
                    },
                    {
                      startDate: { gte: period.from },
                      endDate: { lte: period.to },
                    },
                  ],
                },
                // 🔸 Ignora o booking atual para não gerar auto-conflito
                ignoreBookingId ? { id: { not: ignoreBookingId } } : {},
              ],
            },
          },
        },
      },
      orderBy: { name: 'asc' },
      include: { type: true },
    })

    return units
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
          where: { ...activeBookingStatuses },
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
