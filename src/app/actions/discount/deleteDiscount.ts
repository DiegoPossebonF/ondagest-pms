'use server'

import { updateBookingPaymentStatus } from '../booking/updateBookingPaymentStatus'
import dbWithTenant from '../utils/dbWithTenant'

export async function deleteDiscount(discountId: string) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  try {
    if (!discountId)
      return {
        success: false,
        msg: 'ID do desconto é obrigatorio',
      }

    const deletedDiscount = await db.discount.delete({
      where: {
        id: discountId,
      },
    })

    if (!deletedDiscount) {
      return {
        success: false,
        msg: 'Erro ao deletar desconto - DB',
      }
    }

    await updateBookingPaymentStatus(deletedDiscount.bookingId)

    return {
      success: true,
      payment: deletedDiscount,
      msg: 'Desconto removido com sucesso',
    }
  } catch (err) {
    console.error('Erro ao deletar desconto', err)
    return {
      success: false,
      msg: 'Erro interno ao deletar desconto - entre em contato com o suporte',
    }
  }
}
