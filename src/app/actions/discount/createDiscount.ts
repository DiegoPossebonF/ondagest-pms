'use server'
import type { Discount } from '@/app/generated/prisma'
import db from '@/lib/db'

type DiscountPayload = Omit<Discount, 'id' | 'createdAt'>

export async function createDiscount(discount: DiscountPayload) {
  try {
    if (!discount) {
      return {
        success: false,
        msg: 'Erro ao criar desconto - dados inválidos',
      }
    }

    const discountCreated = await db.discount.create({
      data: {
        ...discount,
      },
    })

    if (!discountCreated) {
      return {
        success: false,
        msg: 'Erro ao criar desconto - DB',
      }
    }

    return {
      success: true,
      discount: discountCreated,
      msg: 'Desconto lançado com sucesso',
    }
  } catch (err) {
    console.error('Erro ao criar desconto', err)
    return {
      success: false,
      msg: 'Erro interno ao criar desconto - entre em contato com o suporte',
    }
  }
}
