'use server'
import db from '@/lib/db'
import { updateBookingPaymentStatus } from '@/lib/db/actions/updateBookingPaymentStatus'
import { updateBookingStatusIfNeeded } from '@/lib/db/actions/updateBookingStatusIfNeeded'
import { getBookingById } from '../booking/actions'

export async function deletePayment(paymentId: string) {
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
