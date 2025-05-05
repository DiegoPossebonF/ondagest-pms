import type { Payment } from '@/app/generated/prisma'
import { updateBookingPaymentStatus } from '@/lib/actions/updateBookingPaymentStatus'

export async function deletePayment(payment: Payment) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/payments/${payment.id}`,
      {
        method: 'DELETE',
      }
    )

    const data = await res.json()
    if (!data.error) {
      await updateBookingPaymentStatus(payment.bookingId)
      return data
    }

    throw new Error(data.error)
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message }
    }
  }
}
