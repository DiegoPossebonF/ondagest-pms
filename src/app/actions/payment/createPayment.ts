'use server'
import type { Payment, PaymentType } from '@/app/generated/prisma'
import { updateBookingPaymentStatus } from '@/lib/actions/updateBookingPaymentStatus'
import db from '@/lib/db'
import { type PaymentSchema, paymentSchema } from '@/schemas/payment-schema'

type PaymentPayload = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>

export async function createPayment(data: PaymentSchema) {
  const parsed = paymentSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const payment = parsed.data

  try {
    // 1. Buscar a reserva
    const booking = await db.booking.findUnique({
      where: { id: Number(payment.bookingId) },
      include: { payments: true },
    })

    if (!booking) {
      return {
        error: 'Erro ao criar pagamento - Reserva nao encontrada',
      }
    }

    // 2. Criar o pagamento

    const paymentCreated = await db.payment.create({
      data: {
        bookingId: Number(payment.bookingId),
        paymentType: payment.paymentType as PaymentType,
        paidAt: payment.paidAt,
        amount: payment.amount,
      },
    })

    if (!paymentCreated) {
      return {
        error: 'Erro ao criar pagamento - DB',
      }
    }

    // 3. Checar se está PENDING
    if (booking.status === 'PENDING') {
      // 4. Atualizar para CONFIRMED
      await db.booking.update({
        where: { id: Number(payment.bookingId) },
        data: { status: 'CONFIRMED' },
      })
    }

    await updateBookingPaymentStatus(booking.id)

    return {
      success: 'Pagamento lançado com sucesso',
    }
  } catch (err) {
    console.error('Erro ao criar pagamento', err)
    return {
      error: 'Erro interno ao criar pagamento - entre em contato com o suporte',
    }
  }
}
