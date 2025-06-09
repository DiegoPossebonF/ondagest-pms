import db from '@/lib/db'
import type { UnitWithType } from '@/types/unit'
import { NextResponse } from 'next/server'
import type { DateRange } from 'react-day-picker'

// GET: Busca acomodação pelo ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ period: string }> }
) {
  try {
    const { period } = await params

    const periodDateRange: DateRange = JSON.parse(period)

    const { from: startDate, to: endDate } = periodDateRange

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Datas inválidas' }, { status: 400 })
    }

    const bookings = await db.booking.findMany({
      where: {
        OR: [
          {
            AND: [
              { startDate: { gte: startDate } },
              { startDate: { lte: endDate } },
            ],
          },
          {
            AND: [
              { endDate: { gte: startDate } },
              { endDate: { lte: endDate } },
            ],
          },
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: endDate } },
            ],
          },
        ],
      },
      include: {
        unit: true,
        guest: true,
        payments: true,
        services: true,
        discounts: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    })

    const units: UnitWithType[] = await db.unit.findMany({
      include: { type: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ bookings, units }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}
