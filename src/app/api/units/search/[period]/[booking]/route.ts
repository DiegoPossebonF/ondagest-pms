import db from '@/lib/db'
import { NextResponse } from 'next/server'
import type { DateRange } from 'react-day-picker'

// GET: Busca hóspedes por nome
export async function GET(
  request: Request,
  { params }: { params: Promise<{ period: string; booking?: string }> }
) {
  try {
    const { period, booking } = await params

    const periodDateRange: DateRange = JSON.parse(period)

    console.log(periodDateRange)
    console.log('booking', booking)

    if (!period) {
      return NextResponse.json(
        { error: 'O parâmetro "period" é obrigatório!' },
        { status: 400 }
      )
    }

    const availableUnits = await db.unit.findMany({
      where: {
        bookings: {
          none: {
            AND: [
              { startDate: { lt: periodDateRange.to } }, // Começa antes do fim do período
              { endDate: { gt: periodDateRange.from } }, // Termina depois do início do período
              booking
                ? { id: { not: Number.parseInt(booking) } } // Ignora a reserva que está sendo editada
                : {},
              {
                status: {
                  in: ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS'],
                },
              },
            ],
          },
        },
      },
      include: {
        type: { include: { rates: true } }, // Opcional: incluir detalhes do tipo da unidade
        bookings: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(availableUnits, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar Unidades' },
      { status: 500 }
    )
  }
}
