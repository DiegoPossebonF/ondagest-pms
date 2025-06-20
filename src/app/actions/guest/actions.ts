'use server'

import type { Guest } from '@/app/generated/prisma'
import db from '@/lib/db'

interface GetGuestsParams {
  page: number
  perPage: number
  orderBy?: keyof Guest
  direction?: 'asc' | 'desc'
  filters?: {
    name?: string
    email?: string
    phone?: string
    cpf?: string
    city?: string
    carPlate?: string
    startDate?: Date | null
    endDate?: Date | null
  }
}

export async function getGuests({
  page,
  perPage,
  orderBy = 'createdAt',
  direction = 'desc',
  filters = {},
}: GetGuestsParams) {
  const where = {
    name: filters.name ? { contains: filters.name } : undefined,
    email: filters.email ? { contains: filters.email } : undefined,
    phone: filters.phone ? { contains: filters.phone } : undefined,
    cpf: filters.cpf ? { contains: filters.cpf } : undefined,
    city: filters.city ? { contains: filters.city } : undefined,
    carPlate: filters.carPlate ? { contains: filters.carPlate } : undefined,
    createdAt:
      filters.startDate || filters.endDate
        ? {
            gte: filters.startDate ?? undefined,
            lte: filters.endDate ?? undefined,
          }
        : undefined,
  }

  const [guests, total] = await Promise.all([
    db.guest.findMany({
      where,
      orderBy: {
        [orderBy]: direction,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.guest.count({ where }),
  ])

  return {
    data: guests,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  }
}
