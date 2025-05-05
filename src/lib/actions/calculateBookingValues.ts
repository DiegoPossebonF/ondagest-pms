import type { BookingAllIncludes } from '@/types/booking'

export default function calculateBookingValues(booking?: BookingAllIncludes) {
  if (!booking) return

  const totalAmount = booking.totalAmount ?? 0

  const totalPayment =
    booking.payments.reduce((sum, payment) => sum + payment.amount, 0) ?? 0

  const totalServices =
    booking.services.reduce((sum, service) => sum + service.amount, 0) ?? 0

  const totalDiscount =
    booking.discounts.reduce((sum, discount) => sum + discount.amount, 0) ?? 0

  const totalAll = totalAmount + totalServices - totalDiscount

  return {
    totalAmount,
    totalPayment,
    totalServices,
    totalDiscount,
    totalAll,
  }
}
