import db from '@/lib/db'
import { NextResponse } from 'next/server'
import type { DateRange } from 'react-day-picker'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ period: string }> }
) {
  try {
    const { period } = await params

    const periodDateRange: DateRange = JSON.parse(period)

    console.log(periodDateRange)

    if (!period) {
      return NextResponse.json(
        { error: 'O parâmetro "period" é obrigatório!' },
        { status: 400 }
      )
    }

    const units = await db.unit.findMany({
      include: {
        bookings: {
          where: {
            OR: [
              {
                startDate: {
                  lte: periodDateRange.to, // Começa antes ou durante o período
                },
                endDate: {
                  gte: periodDateRange.from, // Termina depois ou durante o período
                },
              },
            ],
          },
          include: {
            guest: true, // Traz informações do hóspede para exibição
          },
          orderBy: {
            startDate: 'asc', // Ordenar cronologicamente
          },
        },
      },
      orderBy: {
        name: 'asc', // Ordenar as unidades alfabeticamente
      },
    })

    return NextResponse.json(units, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar Unidades por período' },
      { status: 500 }
    )
  }
}
