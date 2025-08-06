'use server'

import db from '@/lib/db'
import { STATUS_LABELS } from '@/lib/utils'
import type { BookingStatus } from '@prisma/client'
import validateBookingStatusChange from './validateBookingStatusChange'

export async function cancelBooking(
  id: number,
  status: 'CANCELLED' | 'NO_SHOW'
) {
  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      guest: true,
      unit: {
        include: {
          type: { include: { rates: { include: { type: true } } } },
        },
      },
      payments: true,
      services: true,
      discounts: true,
      rate: { include: { type: true } },
    },
  })

  if (!booking) {
    return {
      error: 'Reserva nao encontrada!',
    }
  }

  const validation = await validateBookingStatusChange(
    booking,
    status as BookingStatus
  )

  if (validation.error) {
    return {
      error: validation.error,
    }
  }

  try {
    await db.booking.update({
      where: { id },
      data: {
        status,
      },
    })

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
