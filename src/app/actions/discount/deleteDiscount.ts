'use server'
import db from '@/lib/db'
import { updateBookingPaymentStatus } from '@/lib/db/actions/updateBookingPaymentStatus'

export async function deleteDiscount(discountId: string) {
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
