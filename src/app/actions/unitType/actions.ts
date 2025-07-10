'use server'

import type { Prisma } from '@/app/generated/prisma'
import db from '@/lib/db'

type UnitTypeWithUnitsAndRates = Prisma.UnitTypeGetPayload<{
  include: { units: true; rates: true }
}>

export async function getUnitTypes() {
  try {
    const unitTypes: UnitTypeWithUnitsAndRates[] = await db.unitType.findMany({
      orderBy: { name: 'asc' },
      include: { units: true, rates: true },
    })

    return {
      success: 'Tipos de acomodações buscados com sucesso',
      data: unitTypes,
    }
  } catch (error) {
    console.error('Erro ao buscar tipos de acomodações', error)
    return {
      error:
        'Erro ao buscar tipos de acomodações - tente novamente ou contate o suporte!',
      data: null,
    }
  }
}
