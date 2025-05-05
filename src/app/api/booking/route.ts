import db from '@/lib/db'
import type { BookingAllIncludes } from '@/types/booking'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { guestId, unitId, period, status, totalAmount, numberOfPeople } =
      body

    const booking: BookingAllIncludes = await db.booking.create({
      data: {
        guestId,
        unitId,
        startDate: period.from,
        endDate: period.to,
        totalAmount,
        numberOfPeople,
      },
      include: {
        guest: true,
        unit: { include: { type: { include: { rates: true } } } },
        payments: true,
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar a reserva!' },
      { status: 500 }
    )
  }
}
