'use server'
import db from '@/lib/db'

export async function getUnits() {
  const units = await db.unit.findMany({
    include: {
      type: true,
      bookings: {
        include: {
          guest: true,
          unit: {
            include: {
              type: {
                include: {
                  rates: {
                    include: {
                      type: true,
                    },
                  },
                },
              },
            },
          },
          payments: {
            orderBy: { paidAt: 'desc' },
          },
          services: true,
          discounts: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  if (!units) {
    throw new Error('Erro ao buscar Unidades')
  }
  return units
}

export async function getServices() {
  const services = await db.service.findMany({
    distinct: ['name'],
    orderBy: { createdAt: 'desc' },
  })

  if (!services) {
    return []
  }

  return services
}
