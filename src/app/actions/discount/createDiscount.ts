'use server'

import { type DiscountSchema, discountSchema } from '@/schemas/discount-schema'
import { updateBookingPaymentStatus } from '../booking/updateBookingPaymentStatus'
import dbWithTenant from '../utils/dbWithTenant'

export async function createDiscount(data: DiscountSchema) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  const parsed = discountSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const discount = parsed.data

  try {
    const discountCreated = await db.discount.create({
      data: {
        bookingId: Number(discount.bookingId),
        reason: discount.reason,
        amount: discount.amount,
      },
    })

    if (!discountCreated) {
      return {
        error: 'Erro DB ao criar desconto - entre em contato com o suporte!',
      }
    }

    await updateBookingPaymentStatus(Number(discount.bookingId))

    return {
      success: 'Desconto lançado com sucesso',
    }
  } catch (err) {
    console.error('Erro ao criar desconto', err)
    return {
      error: 'Erro interno ao criar desconto - entre em contato com o suporte',
    }
  }
}
