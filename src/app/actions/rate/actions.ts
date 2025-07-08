'use server'
import type { Prisma } from '@/app/generated/prisma'
import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export type RateWithUnitType = Prisma.RateGetPayload<{
  include: { type: true }
}>

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
