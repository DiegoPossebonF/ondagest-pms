'use server'
import type { Payment } from '@/app/generated/prisma'
import db from '@/lib/db'

type PaymentPayload = Omit<Payment, 'createdAt' | 'updatedAt'>

export async function updatePayment(payment: PaymentPayload) {
  try {
    if (!payment) {
      return {
        success: false,
        msg: 'Erro ao atualizar pagamento - dados inválidos',
      }
    }

    const paymentUpdated = await db.payment.update({
      where: { id: payment.id },
      data: {
        ...payment,
      },
    })

    if (!paymentUpdated) {
      return {
        success: false,
        msg: 'Erro ao atualizar pagamento - DB',
      }
    }

    return {
      success: true,
      payment: paymentUpdated,
      msg: 'Pagamento atualizado com sucesso',
    }
  } catch (err) {
    console.error('Erro ao atualizar pagamento', err)
    return {
      success: false,
      msg: 'Erro interno ao atualizar pagamento - entre em contato com o suporte',
    }
  }
}
