'use server'
import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function deleteUnitType(unitTypeId: string) {
  // Verifique se o tipo de unidade existe
  const unitType = await db.unitType.findUnique({
    where: { id: unitTypeId },
  })

  if (!unitType) {
    return { error: 'Tipo de unidade não encontrado' }
  }

  // Verifique se o tipo de unidade possui acomodações
  const units = await db.unit.findMany({
    where: { typeId: unitTypeId },
  })

  if (units.length > 0) {
    return {
      error:
        'Tipo de unidade está vinculado a uma ou mais acomodações. Primeiro exclua as acomodações antes de excluir o tipo de unidade.',
    }
  }
  try {
    // Excluir o tipo de unidade
    await db.unitType.delete({
      where: { id: unitTypeId },
    })

    revalidatePath('/settings/unit-types')
    return { success: 'Tipo de unidade excluído com sucesso' }
  } catch (error) {
    console.error('Erro ao excluir o tipo de unidade:', error)
    return { error: 'Erro ao excluir o tipo de unidade' }
  }
}
