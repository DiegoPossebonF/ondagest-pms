// src/actions/booking.ts

'use server'

import { BookingStatus, PricingMode } from '@/app/generated/prisma'
import db from '@/lib/db'
import { updateBookingStatusIfNeeded } from '@/lib/db/actions/updateBookingStatusIfNeeded'
import { type BookingSchema, bookingSchema } from '@/schemas/booking-schema'
import { revalidatePath } from 'next/cache'
import validateBookingStatusChange from './validateBookingStatusChange'

export async function updateBooking(id: number, data: BookingSchema) {
  const parsed = bookingSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

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

  const {
    guestId,
    unitId,
    rateId,
    period,
    numberOfPeople,
    totalAmount,
    pricingMode,
    daily,
  } = parsed.data

  const { status } = parsed.data

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
    const updatedBooking = await db.booking.update({
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

    if (!updatedBooking) {
      return {
        error: 'Erro ao atualizar reserva',
      }
    }

    const updatedFinal = await updateBookingStatusIfNeeded(updatedBooking)

    revalidatePath(`/bookings/${id}`)
    return {
      success: 'Reserva atualizada com sucesso!',
      booking: updatedFinal,
    }
  } catch (error) {
    console.error('#### Erro ao atualizar reserva', error)
    return {
      error: 'Erro ao atualizar reserva',
    }
  }
}
