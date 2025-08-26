// src/actions/user.ts
'use server'
import { type RateSchema, rateSchema } from '@/schemas/rate-schema'
import { revalidatePath } from 'next/cache'
import dbWithTenant from '../utils/dbWithTenant'

export async function createRate(data: RateSchema) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  const parsed = rateSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, typeId, value, numberOfPeople } = parsed.data

  try {
    // Verifica se já existe rate com os mesmos critérios
    const existingRate = await db.rate.findFirst({
      where: {
        name,
        numberOfPeople,
        typeId,
      },
    })

    if (existingRate) {
      return {
        error: `Já existe uma tarifa "${name}" para ${numberOfPeople} pessoas nesse tipo de acomodação.`,
      }
    }

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
