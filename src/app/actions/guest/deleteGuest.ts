// src/actions/booking.ts

'use server'
import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function deleteGuest(id: string) {
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
