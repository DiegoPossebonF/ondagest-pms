'use server'
import type { Role, User } from '@/app/generated/prisma'
import db from '@/lib/db'

interface GetUsersParams {
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
  console.log('filters', filters)
  const where = {
    name: filters.name ? { contains: filters.name } : undefined,
    email: filters.email ? { contains: filters.email } : undefined,
    role: { in: filters.role ? filters.role : undefined },
    createdAt: filters.createdAt ? { gte: filters.createdAt } : undefined,
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

  console.log('users', users)

  return {
    data: users,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  }
}
