'use server'
import db from '@/lib/db'
import { Prisma, type Role, type User } from '@prisma/client'

export interface GetUsersParams {
  page: number
  perPage: number
  orderBy?: keyof User
  direction?: 'asc' | 'desc'
  filters?: {
    name?: string
    email?: string
    role?: Role[]
    createdAt?: Date | null
  }
}
export async function getUsers({
  page,
  perPage,
  orderBy = 'createdAt',
  direction = 'desc',
  filters = {},
}: GetUsersParams) {
  try {
    const where: Prisma.UserWhereInput = {
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

      role: filters.role?.length
        ? {
            in: filters.role,
          }
        : undefined,

      createdAt: filters.createdAt
        ? {
            gte: new Date(filters.createdAt),
          }
        : undefined,
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
        },
        where,
        orderBy: {
          [orderBy]: direction,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.user.count({ where }),
    ])

    return {
      data: {
        users,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    }
  } catch (error) {
    console.error('Erro ao buscar usuários (getUsers)', error)
    return {
      data: null,
      error: 'Erro ao buscar usuários - tente novamente ou contate o suporte!',
    }
  }
}
