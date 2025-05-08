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
