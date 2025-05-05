import db from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const paymentSchema = z.object({
  bookingId: z.number(),
  amount: z.number().positive(),
  paymentType: z.enum([
    'CASH',
    'PIX',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'BANK_TRANSFER',
    'OTHER',
  ]),
  paidAt: z.date(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = paymentSchema.parse({
      ...body,
      paidAt: new Date(body.paidAt), // <-- transforma string em Date real
    })

    const booking = await db.booking.findUnique({
      where: { id: parsed.bookingId },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Erro ao lançar pagamento - Reserva não encontrada' },
        { status: 404 }
      )
    }

    const payment = await db.payment.create({
      data: {
        bookingId: booking.id,
        paymentType: parsed.paymentType,
        paidAt: parsed.paidAt,
        amount: parsed.amount,
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (err) {
    console.error(err)

    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
