// src/actions/booking.ts

'use server'
import { revalidatePath } from 'next/cache'
import dbWithTenant from '../utils/dbWithTenant'

export async function deleteGuest(id: string) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  try {
    const containsBookings = await db.booking.findFirst({
      where: { guestId: id },
    })

    if (containsBookings) {
      return {
        error:
          'Não é possível deletar este hóspede, pois ele possui registros de reservas. ',
      }
    }

    await db.guest.delete({
      where: { id },
    })

    revalidatePath('/guests')
    return {
      success: 'Hóspede deletado com sucesso!',
    }
  } catch (error) {
    console.error('#### Erro ao deletar hóspede', error)
    return {
      error: 'Erro ao deletar hóspede',
    }
  }
}
