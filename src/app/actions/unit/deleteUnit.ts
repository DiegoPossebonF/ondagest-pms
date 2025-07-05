'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function deleteUnit(unitId: string) {
  // Verificar se a acomodação existe
  const unit = await db.unit.findUnique({
    where: { id: unitId },
  })

  if (!unit) {
    return { error: 'Acomodação não encontrada' }
  }

  // Verificar se a acomodação possui reservas
  const bookings = await db.booking.findMany({
    where: { unitId: unitId },
  })

  if (bookings.length > 0) {
    return {
      error:
        'Acomodação possui reservas. Não é possivel excluir, somente desabilitar a acomodação.',
    }
  }

  try {
    await db.unit.delete({
      where: { id: unitId },
    })

    revalidatePath('/settings/units')
    return { success: 'Acomodação excluida com sucesso' }
  } catch (error) {
    console.error('#### Erro ao excluir acomodação', error)
    return { error: 'Erro ao excluir acomodação' }
  }
}
