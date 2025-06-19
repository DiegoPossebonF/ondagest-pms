// src/actions/booking.ts

'use server'

import { BookingStatus } from '@/app/generated/prisma'
import db from '@/lib/db'
import { type BookingSchema, bookingSchema } from '@/schemas/booking-schema'
import { revalidatePath } from 'next/cache'

export async function updateBooking(id: number, data: BookingSchema) {
  const parsed = bookingSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const {
    status,
    guestId,
    unitId,
    rateId,
    period,
    numberOfPeople,
    totalAmount,
  } = parsed.data

  try {
    await db.booking.update({
      where: { id },
      data: {
        guestId,
        unitId,
        rateId,
        startDate: period.from,
        endDate: period.to,
        numberOfPeople,
        totalAmount,
        status: BookingStatus[status as keyof typeof BookingStatus],
      },
    })

    revalidatePath(`/bookings/${id}`)
    return {
      success: 'Reserva atualizada com sucesso!',
    }
  } catch (error) {
    console.error('#### Erro ao atualizar reserva', error)
    return {
      error: 'Erro ao atualizar reserva',
    }
  }
}
