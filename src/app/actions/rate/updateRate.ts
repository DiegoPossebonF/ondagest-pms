'use server'

import db from '@/lib/db'
import { type RateSchema, rateSchema } from '@/schemas/rate-schema'
import { revalidatePath } from 'next/cache'

export async function updateRate(rateId: string, data: RateSchema) {
  const parsed = rateSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, typeId, value, numberOfPeople } = parsed.data

  // Verifica se já tem uma tarifa com o mesmo nome e quantidade de pessoas, mas ignora a tarifa atual
  const existingRate = await db.rate.findFirst({
    where: {
      AND: [
        {
          name,
          numberOfPeople,
        },
        { name, typeId },
      ],
      NOT: { id: rateId },
    },
  })

  if (existingRate) {
    return { error: 'Tarifa já cadastrada com a mesma quantidade de pessoas!' }
  }

  try {
    await db.rate.update({
      where: { id: rateId },
      data: {
        name,
        typeId,
        value,
        numberOfPeople,
      },
    })

    revalidatePath('/settings/rates')
    return { success: 'Tarifa atualizada com sucesso' }
  } catch (error) {
    console.error('#### Erro ao atualizar tarifa', error)
    return { error: 'Erro ao atualizar tarifa' }
  }
}
