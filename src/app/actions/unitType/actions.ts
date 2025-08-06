'use server'

import db from '@/lib/db'
import type { Prisma } from '@prisma/client'

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
