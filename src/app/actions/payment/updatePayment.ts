'use server'

import { type PaymentSchema, paymentSchema } from '@/schemas/payment-schema'
import type { PaymentType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { updateBookingPaymentStatus } from '../booking/updateBookingPaymentStatus'
import dbWithTenant from '../utils/dbWithTenant'

export async function updatePayment(paymentId: string, data: PaymentSchema) {
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

  const { paymentType, amount, paidAt, bookingId } = parsed.data

  try {
    await db.payment.update({
      where: { id: paymentId },
      data: {
        paymentType: paymentType as PaymentType,
        amount,
        paidAt,
      },
    })

    await updateBookingPaymentStatus(Number(bookingId))

    revalidatePath(`/bookings/${paymentId}`)
    return {
      success: 'Pagamento atualizado com sucesso!',
    }
  } catch (error) {
    console.error('#### Erro ao atualizar pagamento', error)
    return {
      error:
        'Erro ao atualizar pagamento. Por favor, tente novamente mais tarde ou contate o suporte.',
    }
  }
}
