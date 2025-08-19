'use server'
import type { Prisma } from '@prisma/client'
import dbWithTenant from '../utils/dbWithTenant'

type UnitTypeWithUnitsAndRates = Prisma.UnitTypeGetPayload<{
  include: { units: true; rates: true }
}>

export async function getUnitTypes() {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

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
