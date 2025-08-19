'use server'

import { type Guest, Prisma } from '@prisma/client'
import dbWithTenant from '../utils/dbWithTenant'

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
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  try {
    const where: Prisma.GuestWhereInput = {
      name: filters.name
        ? {
            contains: filters.name,
            mode: Prisma.QueryMode.insensitive,
          }
        : undefined,

      email: filters.email
        ? {
            contains: filters.email,
            mode: Prisma.QueryMode.insensitive,
          }
        : undefined,

      phone: filters.phone
        ? {
            contains: filters.phone,
            mode: Prisma.QueryMode.insensitive,
          }
        : undefined,

      cpf: filters.cpf
        ? {
            contains: filters.cpf,
            mode: Prisma.QueryMode.insensitive,
          }
        : undefined,

      city: filters.city
        ? {
            contains: filters.city,
            mode: Prisma.QueryMode.insensitive,
          }
        : undefined,

      carPlate: filters.carPlate
        ? {
            contains: filters.carPlate,
            mode: Prisma.QueryMode.insensitive,
          }
        : undefined,

      createdAt:
        filters.startDate || filters.endDate
          ? {
              gte: filters.startDate ? new Date(filters.startDate) : undefined,
              lte: filters.endDate ? new Date(filters.endDate) : undefined,
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

  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

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
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

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

export async function getGuestsOrderUpdated() {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  try {
    const guests = await db.guest.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
    })
    return guests
  } catch (error) {
    console.log(error)
    return null
  }
}
