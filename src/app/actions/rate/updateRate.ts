'use server'
import { type RateSchema, rateSchema } from '@/schemas/rate-schema'
import { revalidatePath } from 'next/cache'
import dbWithTenant from '../utils/dbWithTenant'

export async function updateRate(rateId: string, data: RateSchema) {
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

  // Verifica se já existe rate com os mesmos critérios, mas ignora a tarifa atual
  const existingRate = await db.rate.findFirst({
    where: {
      name,
      numberOfPeople,
      typeId,
      NOT: { id: rateId },
    },
  })

  if (existingRate) {
    return {
      error: `Já existe uma tarifa "${name}" para ${numberOfPeople} pessoas nesse tipo de acomodação.`,
    }
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
