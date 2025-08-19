'use server'
import { STATUS_LABELS } from '@/lib/utils'
import type { BookingStatus } from '@prisma/client'
import dbWithTenant from '../utils/dbWithTenant'
import validateBookingStatusChange from './validateBookingStatusChange'

export async function cancelBooking(
  id: number,
  status: 'CANCELLED' | 'NO_SHOW'
) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  try {
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
