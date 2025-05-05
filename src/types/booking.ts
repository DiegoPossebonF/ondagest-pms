import type { Prisma } from '@/app/generated/prisma/client'

export type BookingAllIncludes = Prisma.BookingGetPayload<{
  include: {
    guest: true
    unit: {
      include: { type: { include: { rates: { include: { type: true } } } } }
    }
    payments: true
    services: true
    discounts: true
  }
}>
