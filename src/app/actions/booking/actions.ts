'use server'
import type {
  BookingStatus,
  PaymentStatus,
  Prisma,
} from '@/app/generated/prisma'
import type { SortKey } from '@/components/booking/BookingsFiltersProvider'
import db from '@/lib/db'
import { activeBookingStatuses } from '@/lib/db/scopes'
import type { BookingAllIncludes } from '@/types/booking'

interface GetBookingsParams {
  page?: number
  perPage?: number
  sortKey?: SortKey
  sortDirection?: 'asc' | 'desc'
  filters?: {
    guestName?: string
    unitName?: string
    status?: BookingStatus
    paymentStatus?: PaymentStatus
    startDate?: string | null
    endDate?: string | null
  }
}

export async function getBookings({
  page = 1,
  perPage = 10,
  sortKey = 'startDate',
  sortDirection = 'desc',
  filters = {},
}: GetBookingsParams) {
  const where: Prisma.BookingWhereInput = {
    guest: {
      name: filters.guestName ? { contains: filters.guestName } : undefined,
    },
    unit: {
      name: filters.unitName ? { contains: filters.unitName } : undefined,
    },
    status: {
      in: filters.status ? [filters.status] : undefined,
      notIn: ['CANCELLED', 'NO_SHOW'] as BookingStatus[],
    },
    paymentStatus: filters.paymentStatus || undefined,
    startDate: filters.startDate
      ? { gte: new Date(filters.startDate) }
      : undefined,
    endDate: filters.endDate ? { lte: new Date(filters.endDate) } : undefined,
  }

  const orderBy = (() => {
    if (sortKey === 'guest') {
      return { guest: { name: sortDirection } }
    }
    if (sortKey === 'unit') {
      return { unit: { name: sortDirection } }
    }
    return { [sortKey]: sortDirection }
  })()

  const [bookings, totalCount] = await Promise.all([
    db.booking.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
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
    }),
    db.booking.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / perPage)

  return {
    data: bookings,
    totalCount,
    totalPages,
    page,
    perPage,
  }
}

export async function getBookingsPerPeriod(period: { from: Date; to: Date }) {
  try {
    const bookings: BookingAllIncludes[] = await db.booking.findMany({
      where: {
        ...activeBookingStatuses,
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

export async function getBookingById(id: number) {
  try {
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        guest: true,
        unit: { include: { type: { include: { rates: true } } } },
        payments: { orderBy: { paidAt: 'desc' } },
        discounts: { orderBy: { createdAt: 'desc' } },
        services: { orderBy: { createdAt: 'desc' } },
        rate: { include: { type: true } },
      },
    })

    return booking
  } catch (error) {
    console.error('Erro ao buscar reserva:', error)
    return null
  }
}
