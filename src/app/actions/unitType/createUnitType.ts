// src/actions/user.ts
'use server'
import { type UnitTypeSchema, unitTypeSchema } from '@/schemas/unit-type-schema'
import { revalidatePath } from 'next/cache'
import dbWithTenant from '../utils/dbWithTenant'

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
    const { db: dbData, error } = await dbWithTenant()
    if (error) throw new Error(error)
    if (!dbData) throw new Error('Banco de dados não disponível')

    const db = dbData

    // Verifique se o tipo de acomodação já existe
    const existingUnitType = await db.unitType.findFirst({
      where: { name },
    })

    if (existingUnitType) {
      return { error: 'Tipo de acomodação já cadastrado!' }
    }

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
