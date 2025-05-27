'use server'
import type { Payment } from '@/app/generated/prisma'
import db from '@/lib/db'

type PaymentPayload = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>

export async function createPayment(payment: PaymentPayload) {
  try {
    if (!payment) {
      return {
        success: false,
        msg: 'Erro ao criar pagamento - dados inválidos',
      }
    }

    const paymentCreated = await db.payment.create({
      data: {
        ...payment,
      },
    })

    if (!paymentCreated) {
      return {
        success: false,
        msg: 'Erro ao criar pagamento - DB',
      }
    }

    // 2. Buscar a reserva
    const booking = await db.booking.findUnique({
      where: { id: payment.bookingId },
      include: { payments: true },
    })

    if (!booking) {
      return {
        success: false,
        msg: 'Erro ao criar pagamento - Reserva nao encontrada',
      }
    }

    // 3. Checar se está PENDING
    if (booking.status === 'PENDING') {
      // 4. Atualizar para CONFIRMED
      await db.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CONFIRMED' },
      })
    }

    return {
      success: true,
      payment: paymentCreated,
      msg: 'Pagamento lançado com sucesso',
    }
  } catch (err) {
    console.error('Erro ao criar pagamento', err)
    return {
      success: false,
      msg: 'Erro interno ao criar pagamento - entre em contato com o suporte',
    }
  }
}
