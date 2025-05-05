import { Prisma } from '@/app/generated/prisma'
import db from '@/lib/db'
import type { BookingAllIncludes } from '@/types/booking'
import { NextResponse } from 'next/server'

// GET: Busca acomodação pelo ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params

    const booking: BookingAllIncludes | null = await db.booking.findUnique({
      where: { id: Number(id) },
      include: {
        guest: true,
        unit: { include: { type: { include: { rates: true } } } },
        payments: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Reserva nao encontrada!' },
        { status: 404 }
      )
    }

    return NextResponse.json(booking, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// PUT: Atualiza acomodação pelo ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { guestId, period, unitId, numberOfPeople, totalAmount } = body

    const data = await db.booking.update({
      where: { id: Number(id) },
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

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update booking - PUT' },
      { status: 500 }
    )
  }
}

// DELETE: Remove acomodação pelo ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = await params
    await db.booking.delete({ where: { id } })

    return NextResponse.json(
      { message: 'Reserva removida com sucesso!' },
      {
        status: 200,
      }
    )
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'ID não encontrado para exclusão.' },
          { status: 404 }
        )
      }

      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          {
            error:
              'Não foi possível excluir devido a dependências. Primeiro exclua todos os dados relacionados.',
          },
          { status: 400 }
        )
      }
    }

    // Tratamento genérico para outros erros
    return NextResponse.json(
      { error: 'Erro interno ao excluir o registro.' },
      { status: 500 }
    )
  }
}
