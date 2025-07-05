'use server'
import db from '@/lib/db'
import { type UnitTypeSchema, unitTypeSchema } from '@/schemas/unit-type-schema'
import { revalidatePath } from 'next/cache'

export async function updateUnitType(id: string, data: UnitTypeSchema) {
  const parsed = unitTypeSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, description, numberOfPeople } = parsed.data

  try {
    await db.unitType.update({
      where: { id },
      data: {
        name,
        description,
        numberOfPeople,
      },
    })

    revalidatePath('/settings/unit-types')
    return { success: 'Tipo de acomodação atualizado com sucesso' }
  } catch (error) {
    console.error('#### Erro ao atualizar tipo de acomodação', error)
    return { error: 'Erro ao atualizar tipo de acomodação' }
  }
}
