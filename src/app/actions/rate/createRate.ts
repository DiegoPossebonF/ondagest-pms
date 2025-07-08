// src/actions/user.ts
'use server'

import db from '@/lib/db'
import { type RateSchema, rateSchema } from '@/schemas/rate-schema'
import { revalidatePath } from 'next/cache'

export async function createRate(data: RateSchema) {
  const parsed = rateSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, typeId, value, numberOfPeople } = parsed.data

  // Verifica se já tem uma tarifa com o mesmo nome e quantidade de pessoas
  const existingRate = await db.rate.findFirst({
    where: {
      AND: [
        {
          name,
          numberOfPeople,
        },
        { name, typeId },
      ],
    },
  })

  if (existingRate) {
    return { error: 'Tarifa ja cadastrada com a mesma quantidade de pessoas!' }
  }

  try {
    await db.rate.create({
      data: {
        typeId,
        name,
        value,
        numberOfPeople,
      },
    })

    revalidatePath('/settings/rates')
    return { success: 'Tarifa criada com sucesso' }
  } catch (error) {
    console.error('#### Erro ao criar tarifa', error)
    return { error: 'Erro ao criar tarifa' }
  }
}
