'use server'
import db from '@/lib/db'

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
