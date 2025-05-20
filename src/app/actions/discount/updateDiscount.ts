'use server'
import type { Discount } from '@/app/generated/prisma'
import db from '@/lib/db'

type DiscountPayload = Omit<Discount, 'createdAt'>

export async function updateDiscount(discount: DiscountPayload) {
  try {
    if (!discount) {
      return {
        success: false,
        msg: 'Erro ao atualizar desconto - dados inválidos',
      }
    }

    const discountUpdated = await db.discount.update({
      where: { id: discount.id },
      data: {
        ...discount,
      },
    })

    if (!discountUpdated) {
      return {
        success: false,
        msg: 'Erro ao atualizar desconto - DB',
      }
    }

    return {
      success: true,
      payment: discountUpdated,
      msg: 'Desconto atualizado com sucesso',
    }
  } catch (err) {
    console.error('Erro ao atualizar desconto', err)
    return {
      success: false,
      msg: 'Erro interno ao atualizar desconto - entre em contato com o suporte',
    }
  }
}
