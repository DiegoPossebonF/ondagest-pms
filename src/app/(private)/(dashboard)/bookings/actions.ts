import db from '@/lib/db'
import type { UnitWithTypeAndBookings } from '@/types/unit'

export async function getUnits(): Promise<UnitWithTypeAndBookings[] | null> {
  try {
    const units: UnitWithTypeAndBookings[] = await db.unit.findMany({
      include: { type: true, bookings: true },
      orderBy: { name: 'asc' },
    })

    if (!units) {
      return null
    }

    return units
  } catch (error) {
    return null
  }
}

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
