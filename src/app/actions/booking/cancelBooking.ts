'use server'

import db from '@/lib/db'
import { STATUS_LABELS } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function cancelBooking(
  id: number,
  status: 'CANCELLED' | 'NO_SHOW'
) {
  try {
    await db.booking.update({
      where: { id },
      data: {
        status,
      },
    })

    revalidatePath('/bookings')

    return {
      success: `Reserva marcada como "${STATUS_LABELS[status]}" com sucesso!`,
    }
  } catch (error) {
    console.error('Erro ao cancelar reserva', error)
    return {
      error: 'Erro ao cancelar reserva',
    }
  }
}
