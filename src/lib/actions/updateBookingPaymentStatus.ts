'use server'
import db from '../db'

// 🔄 Atualiza o status da reserva com base nos pagamentos realizados
export async function updateBookingPaymentStatus(
  bookingId: number
): Promise<void> {
  const [payments, booking] = await Promise.all([
    db.payment.findMany({
      where: { bookingId },
      select: { amount: true },
    }),
    db.booking.findUnique({
      where: { id: bookingId },
      select: {
        totalAmount: true,
        services: true,
        discounts: true,
        payments: true,
      },
    }),
  ])

  if (!booking) return

  const totalAmount = booking?.totalAmount ?? 0

  const totalPayment =
    booking?.payments.reduce((sum, payment) => sum + payment.amount, 0) ?? 0

  const totalServices =
    booking?.services.reduce((sum, service) => sum + service.amount, 0) ?? 0

  const totalDiscount =
    booking?.discounts.reduce((sum, discount) => sum + discount.amount, 0) ?? 0

  const totalAll = totalAmount + totalServices - totalDiscount

  const paymentStatus = totalPayment >= totalAll ? 'COMPLETED' : 'PENDING'

  await db.booking.update({
    where: { id: bookingId },
    data: { paymentStatus },
  })
}
