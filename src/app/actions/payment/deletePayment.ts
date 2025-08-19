'use server'

import { getBookingById } from '../booking/actions'
import { updateBookingPaymentStatus } from '../booking/updateBookingPaymentStatus'
import { updateBookingStatusIfNeeded } from '../booking/updateBookingStatusIfNeeded'
import dbWithTenant from '../utils/dbWithTenant'

export async function deletePayment(paymentId: string) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  try {
    if (!paymentId)
      return {
        success: false,
        msg: 'ID do pagamento é obrigatorio',
      }

    const deletedPayment = await db.payment.delete({
      where: {
        id: paymentId,
      },
    })

    if (!deletedPayment) {
      return {
        success: false,
        msg: 'Erro ao deletar pagamento - DB',
      }
    }

    await updateBookingPaymentStatus(deletedPayment.bookingId)

    await getBookingById(deletedPayment.bookingId).then(async res => {
      if (res.data) {
        await updateBookingStatusIfNeeded(res.data)
      }
    })

    return {
      success: true,
      payment: deletedPayment,
      msg: 'Pagamento removido com sucesso',
    }
  } catch (err) {
    console.error('Erro ao deletar pagamento', err)
    return {
      success: false,
      msg: 'Erro interno ao deletar pagamento - entre em contato com o suporte',
    }
  }
}
