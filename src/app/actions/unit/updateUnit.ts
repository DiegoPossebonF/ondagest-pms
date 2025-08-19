// src/actions/user.ts
'use server'

import { type UnitSchema, unitSchema } from '@/schemas/unit-schema'
import { revalidatePath } from 'next/cache'
import dbWithTenant from '../utils/dbWithTenant'

export async function updateUnit(unitId: string, data: UnitSchema) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  const parsed = unitSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, typeId } = parsed.data

  // Verifica se a acomomodação ja existe
  const existingUnit = await db.unit.findFirst({
    where: { name, NOT: { id: unitId } },
  })

  if (existingUnit) {
    return { error: 'Acomodação já cadastrada!' }
  }

  try {
    await db.unit.update({
      where: { id: unitId },
      data: {
        name,
        typeId,
      },
    })

    revalidatePath('/settings/units')
    return { success: 'Acomodação atualizada com sucesso' }
  } catch (error) {
    console.error('#### Erro ao atualizar acomodação', error)
    return { error: 'Erro ao atualizar acomodação' }
  }
}
