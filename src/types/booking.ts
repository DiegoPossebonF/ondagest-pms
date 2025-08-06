import type { Prisma } from '@prisma/client'

export type BookingAllIncludes = Prisma.BookingGetPayload<{
  include: {
    guest: true
    unit: {
      include: { type: { include: { rates: { include: { type: true } } } } }
    }
    payments: true
    services: true
    discounts: true
    rate: { include: { type: true } }
  }
}>
