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

export async function freeUnitsPerPeriod(
  period: { from: Date; to: Date },
  ignoreBookingId?: number // 👈 Aqui, usamos o ID da booking atual, não da unit
) {
  try {
    const units = await db.unit.findMany({
      where: {
        NOT: {
          bookings: {
            some: {
              AND: [
                {
                  OR: [
                    {
                      startDate: { lte: period.from },
                      endDate: { gte: period.from },
                    },
                    {
                      startDate: { lte: period.to },
                      endDate: { gte: period.to },
                    },
                    {
                      startDate: { gte: period.from },
                      endDate: { lte: period.to },
                    },
                  ],
                },
                // 🔸 Ignora o booking atual para não gerar auto-conflito
                ignoreBookingId ? { id: { not: ignoreBookingId } } : {},
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
      return null
    }

    console.log('UNIT TYPE', unitType)

    const rateNames = await db.rate.groupBy({
      where: { typeId: unitType.typeId },
      by: ['name'],
      orderBy: { name: 'asc' },
    })

    const rates = await db.rate.findMany({
      where: {
        name: { in: rateNames.map(n => n.name) },
        typeId: unitType.typeId,
      },
      orderBy: [{ name: 'asc' }, { numberOfPeople: 'asc' }],
    })

    console.log('RATES', rates)

    const grouped = groupBy(rates, 'name')

    //console.log('GROUP', grouped)
    return grouped
  } catch (error) {
    console.log(error)
    return null
  }
}
