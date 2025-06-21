// src/actions/booking.ts

'use server'

import { BookingStatus, PricingMode } from '@/app/generated/prisma'
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
    pricingMode,
    daily,
  } = parsed.data

  try {
    await db.booking.update({
      where: { id },
      data: {
        guestId: guestId,
        unitId: unitId,
        rateId: rateId || null,
        startDate: period.from,
        endDate: period.to,
        numberOfPeople: numberOfPeople,
        daily: daily,
        totalAmount: totalAmount,
        status: BookingStatus[status as keyof typeof BookingStatus],
        paymentStatus: 'PENDING',
        pricingMode: PricingMode[pricingMode as keyof typeof PricingMode],
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
