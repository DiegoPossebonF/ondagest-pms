// src/actions/booking.ts

'use server'
import type { PaymentType } from '@/app/generated/prisma'
import db from '@/lib/db'
import { updateBookingPaymentStatus } from '@/lib/db/actions/updateBookingPaymentStatus'
import { type PaymentSchema, paymentSchema } from '@/schemas/payment-schema'
import { revalidatePath } from 'next/cache'

export async function updatePayment(paymentId: string, data: PaymentSchema) {
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
