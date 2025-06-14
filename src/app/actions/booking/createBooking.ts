// src/actions/booking.ts

'use server'

import { BookingStatus } from '@/app/generated/prisma'
import db from '@/lib/db'
import { type BookingSchema, bookingSchema } from '@/schemas/booking-schema'
import { revalidatePath } from 'next/cache'

export async function createBooking(data: BookingSchema) {
  const parsed = bookingSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const { status, guestId, unitId, period, numberOfPeople, totalAmount } =
    parsed.data

  try {
    await db.booking.create({
      data: {
        guestId,
        unitId,
        startDate: period.from,
        endDate: period.to,
        numberOfPeople,
        totalAmount,
        status: BookingStatus[status as keyof typeof BookingStatus],
        paymentStatus: 'PENDING',
      },
    })

    revalidatePath('/bookings')
    return {
      success: 'Reserva criada com sucesso!',
    }
  } catch (error) {
    console.error('#### Erro ao criar reserva', error)
    return {
      error: 'Erro ao criar reserva',
    }
  }
}
