import type { Prisma } from '@/app/generated/prisma'
import db from '@/lib/db'

export type RateWithUnitType = Prisma.RateGetPayload<{
  include: { type: true }
}>

export async function getRates() {
  try {
    const rates: RateWithUnitType[] = await db.rate.findMany({
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
