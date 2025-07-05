// src/actions/user.ts
'use server'
import db from '@/lib/db'
import { type UnitTypeSchema, unitTypeSchema } from '@/schemas/unit-type-schema'
import { revalidatePath } from 'next/cache'

export async function createUnitType(data: UnitTypeSchema) {
  const parsed = unitTypeSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, description, numberOfPeople } = parsed.data

  try {
    await db.unitType.create({
      data: {
        name,
        description,
        numberOfPeople,
      },
    })

    revalidatePath('/settings/unit-types')
    return { success: 'Tipo de acomodação criado com sucesso' }
  } catch (error) {
    console.error('#### Erro ao criar tipo de acomodação', error)
    return { error: 'Erro ao criar tipo de acomodação' }
  }
}
