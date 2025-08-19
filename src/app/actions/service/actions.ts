'use server'
import dbWithTenant from '../utils/dbWithTenant'

export async function getServices() {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  const services = await db.service.findMany({
    distinct: ['name'],
    orderBy: { createdAt: 'desc' },
  })

  if (!services) {
    return []
  }

  return services
}

export async function totalAmountServicesByBooking(bookingId: number) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

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
