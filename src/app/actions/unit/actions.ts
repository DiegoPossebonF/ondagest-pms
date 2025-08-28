'use server'

import {
  activeBookingStatuses,
  dashboardBookingStatuses,
} from '@/lib/db/scopes'

import dayjs from '@/lib/dayjs'
import { updateBookingStatusIfNeeded } from '../booking/updateBookingStatusIfNeeded'
import dbWithTenant from '../utils/dbWithTenant'

export async function getUnits() {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

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
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

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

    return { data: unit }
  } catch (error) {
    console.error('Erro ao buscar acomodações por ID (getUnitById)', error)
    return {
      data: null,
      error:
        'Erro ao buscar acomodações por ID - tente novamente ou contate o suporte!',
    }
  }
}

export async function freeUnitsPerPeriod(
  period: { from: Date; to: Date },
  ignoreBookingId?: number
) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  try {
    //const from = dayjs(period.from).startOf('day').toDate()
    //const to = dayjs(period.to).startOf('day').toDate()

    //console.log('from', from)
    //console.log('to', to)

    const units = await db.unit.findMany({
      where: {
        NOT: {
          bookings: {
            some: {
              ...activeBookingStatuses,
              id: ignoreBookingId ? { not: ignoreBookingId } : undefined,
              AND: [
                {
                  startDate: { lt: period.to }, // começa antes do fim do período
                  endDate: { gt: period.from }, // termina depois do início do período
                },
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
    console.error('Erro ao buscar unidades livres:', error)
    return null
  }
}

export async function getUnitsWithUpdatedBookings() {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

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
          orderBy: { startDate: 'asc' },
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

    return {
      data: updatedUnits,
      error: null,
    }
  } catch (error) {
    console.error('Erro ao buscar acomodações atualizadas!', error)
    return {
      data: null,
      error:
        'Erro ao buscar acomodações atualizadas - tente novamente ou contate o suporte!',
    }
  }
}

export async function getUnitsUpdatedBookingsByDate(currentDate: Date) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  try {
    const startDate = dayjs(currentDate).startOf('day').toDate()
    const endDate = dayjs(currentDate).endOf('day').toDate()

    const units = await db.unit.findMany({
      include: {
        type: true,
        bookings: {
          where: {
            ...dashboardBookingStatuses,
            OR: [
              // 1. Reservas que coincidem com a data atual (check-in, check-out ou no meio)
              {
                startDate: { lte: endDate },
                endDate: { gte: startDate },
              },
              // 2. Reservas já passadas que ainda estão ativas
              {
                endDate: { lte: startDate },
              },
            ],
          },
          include: {
            guest: true,
            unit: {
              include: {
                type: {
                  include: {
                    rates: {
                      include: { type: true },
                    },
                  },
                },
              },
            },
            payments: { orderBy: { paidAt: 'desc' } },
            services: true,
            discounts: true,
            rate: { include: { type: true } },
          },
          orderBy: { startDate: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })

    const updatedUnits = await Promise.all(
      units.map(async unit => {
        const updatedBookings = await Promise.all(
          unit.bookings.map(booking => updateBookingStatusIfNeeded(booking))
        )
        return { ...unit, bookings: updatedBookings }
      })
    )

    return {
      data: updatedUnits,
      error: null,
    }
  } catch (error) {
    console.error('Erro ao buscar acomodações atualizadas!', error)
    return {
      data: null,
      error:
        'Erro ao buscar acomodações atualizadas - tente novamente ou contate o suporte!',
    }
  }
}
