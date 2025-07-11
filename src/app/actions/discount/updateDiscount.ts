// src/actions/booking.ts

'use server'
import db from '@/lib/db'
import { updateBookingPaymentStatus } from '@/lib/db/actions/updateBookingPaymentStatus'
import { type DiscountSchema, discountSchema } from '@/schemas/discount-schema'
import { revalidatePath } from 'next/cache'

export async function updateDiscount(discountId: string, data: DiscountSchema) {
  const parsed = discountSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const { reason, amount, bookingId } = parsed.data

  try {
    await db.discount.update({
      where: { id: discountId },
      data: {
        reason,
        amount,
      },
    })

    await updateBookingPaymentStatus(Number(bookingId))

    revalidatePath(`/bookings/${bookingId}`)
    return {
      success: 'Desconto atualizado com sucesso!',
    }
  } catch (error) {
    console.error('#### Erro ao atualizar desconto', error)
    return {
      error:
        'Erro ao atualizar desconto. Por favor, tente novamente mais tarde ou contate o suporte.',
    }
  }
}
