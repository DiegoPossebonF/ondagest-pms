'use server'

import { type PaymentSchema, paymentSchema } from '@/schemas/payment-schema'
import type { Payment, PaymentType } from '@prisma/client'
import { updateBookingPaymentStatus } from '../booking/updateBookingPaymentStatus'
import dbWithTenant from '../utils/dbWithTenant'

type PaymentPayload = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>

export async function createPayment(data: PaymentSchema) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

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
