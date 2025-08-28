'use server'
import dayjs from '@/lib/dayjs'
import { activeBookingStatuses } from '@/lib/db/scopes'
import { type BookingSchema, bookingSchema } from '@/schemas/booking-schema'
import { BookingStatus, PricingMode } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import dbWithTenant from '../utils/dbWithTenant'

export async function createBooking(data: BookingSchema) {
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

    const from = dayjs(period.from).utc().startOf('day').toDate()
    const to = dayjs(period.to).utc().startOf('day').toDate()

    const existingBooking = await db.booking.findFirst({
      where: {
        unitId,
        AND: [{ startDate: { lt: to } }, { endDate: { gt: from } }],
        ...activeBookingStatuses,
      },
    })

    if (existingBooking) {
      return {
        error: 'Acomodação já possui reserva para o período informado',
      }
    }

    await db.booking.create({
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
