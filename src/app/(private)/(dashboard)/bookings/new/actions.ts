'use server'
import db from '@/lib/db'
import { groupBy } from 'lodash'

export async function getGuestsOrderUpdated() {
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

export async function getGuestsByName(name: string) {
  try {
    const guests = await db.guest.findMany({
      where: { name: { contains: name } },
      take: 5,
      orderBy: { name: 'asc' },
    })
    return guests
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function groupedByRateNamePerUnit(unit: string) {
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
