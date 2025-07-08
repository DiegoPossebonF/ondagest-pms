'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function deleteRate(rateId: string) {
  // Verificar se a tarifa existe
  const rate = await db.rate.findUnique({
    where: { id: rateId },
  })

  if (!rate) {
    return { error: 'Tarifa não encontrada!' }
  }

  try {
    await db.rate.delete({
      where: { id: rateId },
    })

    revalidatePath('/settings/rates')
    return { success: 'Tarifa excluida com sucesso!' }
  } catch (error) {
    console.error('Erro ao excluir tarifa:', error)
    return {
      error:
        'Erro ao excluir tarifa. Por favor, tente novamente mais tarde ou contate o suporte.',
    }
  }
}
