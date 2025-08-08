'use server'
import db from '@/lib/db'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export type RateWithUnitType = Prisma.RateGetPayload<{
  include: { type: true }
}>

interface GetRatesParams {
  page: number
  perPage: number
  orderBy?: keyof RateWithUnitType
  direction?: 'asc' | 'desc'
  filters?: {
    name?: string
    value?: number | null
    numberOfPeople?: number | null
    typeId?: string | null
    active?: boolean | null
    createdAt?: Date | null
  }
}

export async function getRatesFilters({
  page,
  perPage,
  orderBy = 'createdAt',
  direction = 'desc',
  filters = {},
}: GetRatesParams) {
  try {
    const where: Prisma.RateWhereInput = {
      name: filters.name
        ? {
            contains: filters.name,
            mode: Prisma.QueryMode.insensitive,
          }
        : undefined,

      value:
        typeof filters.value === 'number'
          ? {
              equals: filters.value,
            }
          : undefined,

      numberOfPeople:
        typeof filters.numberOfPeople === 'number'
          ? {
              equals: filters.numberOfPeople,
            }
          : undefined,

      typeId: filters.typeId
        ? {
            equals: filters.typeId,
          }
        : undefined,

      active:
        typeof filters.active === 'boolean'
          ? {
              equals: filters.active,
            }
          : undefined,

      createdAt: filters.createdAt
        ? {
            gte: new Date(filters.createdAt),
          }
        : undefined,
    }

    const orderByWithType = () => {
      if (orderBy === 'type') {
        return {
          [orderBy]: {
            name: direction,
          },
        }
      }

      return {
        [orderBy]: direction,
      }
    }

    const [rates, total] = await Promise.all([
      db.rate.findMany({
        where,
        orderBy: orderByWithType(),
        include: {
          type: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.rate.count({ where }),
    ])

    return {
      data: {
        rates,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    }
  } catch (error) {
    console.error('Erro ao buscar tarifas:', error)
    return {
      error:
        'Erro ao buscar tarifas. Por favor, tente novamente mais tarde ou contate o suporte.',
      data: null,
    }
  }
}

export async function getRates() {
  try {
    const rates: RateWithUnitType[] = await db.rate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        type: true,
      },
    })

    if (!rates) {
      return { error: 'Nenhuma tarifa cadastrada no momento.' }
    }

    return { rates }
  } catch (error) {
    console.error('Erro ao buscar tarifas:', error)
    return {
      error:
        'Erro ao buscar tarifas. Por favor, tente novamente mais tarde ou contate o suporte.',
    }
  }
}

export async function getActiveRates() {
  try {
    const rates: RateWithUnitType[] = await db.rate.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      include: {
        type: true,
      },
    })

    if (!rates) {
      return { error: 'Nenhuma tarifa ativa no momento.' }
    }

    return { rates }
  } catch (error) {
    console.error('Erro ao buscar tarifas ativas:', error)
    return {
      error:
        'Erro ao buscar tarifas ativas. Por favor, tente novamente mais tarde ou contate o suporte.',
    }
  }
}

export async function toggleActiveRate(rateId: string, active: boolean) {
  try {
    await db.rate.update({
      where: { id: rateId },
      data: { active },
    })

    revalidatePath('/settings/rates')
    return {
      success: `Tarifa ${active ? 'ativada' : 'desativada'} com sucesso.`,
    }
  } catch (error) {
    console.error(error)
    return { error: 'Erro ao ativar/desativar tarifa' }
  }
}
