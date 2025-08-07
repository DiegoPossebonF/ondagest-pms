'use server'

import db from '@/lib/db'
import type { Guest } from '@prisma/client'

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
  try {
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
      data: {
        guests,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    }
  } catch (error) {
    console.error('Erro ao buscar hóspedes!', error)
    return {
      data: null,
      error:
        'Erro ao buscar hóspedes - tente novamente mais tarde ou contate o suporte!',
    }
  }
}

export async function searchGuestName(searchTerm: string) {
  if (searchTerm.length < 3) {
    return []
  }

  try {
    const guests = await db.guest.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return guests
  } catch (error) {
    console.error('Erro ao buscar hóspedes por nome!', error)
    return []
  }
}

export async function getGuestById(id: string) {
  try {
    const guest = await db.guest.findUnique({
      where: { id },
    })

    if (!guest) {
      return {
        data: null,
        error: 'Hóspede nao encontrado!',
      }
    }

    return {
      data: guest,
      error: null,
    }
  } catch (error) {
    console.error('Erro ao buscar hóspede por ID!', error)
    return {
      data: null,
      error:
        'Erro ao buscar hóspede por ID - tente novamente mais tarde ou contate o suporte!',
    }
  }
}
