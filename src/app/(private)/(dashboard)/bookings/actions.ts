'use server'
import db from '@/lib/db'

export async function totalAmountServicesByBooking(bookingId: number) {
  try {
    const services = await db.service.findMany({
      where: { bookingId },
    })

    if (!services) {
      return null
    }

    const totalAmount = services.reduce(
      (sum, service) => sum + service.amount,
      0
    )

    return totalAmount
  } catch (error) {
    return null
  }
}

export async function getDiscountByBooking(bookingId: number) {
  try {
    const discount = await db.discount.findMany({
      where: { bookingId },
    })

    return discount
  } catch (error) {
    return null
  }
}
