'use server'

import { Prisma } from '@prisma/client'
import { groupBy } from 'lodash'
import { revalidatePath } from 'next/cache'
import dbWithTenant from '../utils/dbWithTenant'

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
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

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
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

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
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

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
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

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

export async function groupedByRateNamePerUnit(unit: string) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  try {
    const unitType = await db.unit.findUnique({
      where: { id: unit },
      select: { typeId: true },
    })

    if (!unitType) {
      return {
        error:
          'Erro ao buscar o tipo da acomodação. Por favor, tente novamente mais tarde ou contate o suporte.',
        data: null,
      }
    }

    const rateNames = await db.rate.groupBy({
      where: { typeId: unitType.typeId },
      by: ['name'],
      orderBy: { name: 'asc' },
    })

    const rates = await db.rate.findMany({
      where: {
        name: { in: rateNames.map(n => n.name) },
        active: true,
        typeId: unitType.typeId,
      },
      orderBy: [{ name: 'asc' }, { numberOfPeople: 'asc' }],
    })

    const grouped = groupBy(rates, 'name')

    //console.log('GROUP', grouped)
    return {
      data: grouped,
    }
  } catch (error) {
    console.error('Erro ao buscar tarifas (groupedByRateNamePerUnit)', error)
    return {
      error:
        'Erro ao buscar tarifas por nome e acomodação. Por favor, tente novamente mais tarde ou contate o suporte.',
      data: null,
    }
  }
}
