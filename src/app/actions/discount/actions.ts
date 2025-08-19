'use server'
import dbWithTenant from '../utils/dbWithTenant'

export async function getDiscountByBooking(bookingId: number) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  try {
    const discount = await db.discount.findMany({
      where: { bookingId },
    })

    return discount
  } catch (error) {
    return null
  }
}
