'use server'

import dayjs from '@/lib/dayjs'
import { activeBookingStatuses } from '@/lib/db/scopes'
import { type BookingSchema, bookingSchema } from '@/schemas/booking-schema'
import { BookingStatus, PricingMode } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import dbWithTenant from '../utils/dbWithTenant'
import { updateBookingStatusIfNeeded } from './updateBookingStatusIfNeeded'
import validateBookingStatusChange from './validateBookingStatusChange'

export async function updateBooking(id: number, data: BookingSchema) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  try {
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
        error: 'Reserva não encontrada!',
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
      status,
    } = parsed.data

    const from = dayjs(period.from).utc().startOf('day').toDate()
    const to = dayjs(period.to).utc().startOf('day').toDate()

    // Verificar se a unit já contem reserva para o perido informado, ignorando a reserva atual
    const existingBooking = await db.booking.findFirst({
      where: {
        unitId,
        AND: [{ startDate: { lt: to } }, { endDate: { gt: from } }],
        ...activeBookingStatuses,
        NOT: { id },
      },
    })

    if (existingBooking) {
      return {
        error: 'A unit já possui uma reserva para o período informado.',
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
