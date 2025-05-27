import type { Prisma } from '@/app/generated/prisma'

export type UnitWithTypeAndBookings = Prisma.UnitGetPayload<{
  include: {
    type: true
    bookings: {
      include: {
        guest: true
        unit: {
          include: { type: { include: { rates: { include: { type: true } } } } }
        }
        payments: true
        services: true
        discounts: true
      }
    }
  }
}>

export type UnitWithType = Prisma.UnitGetPayload<{ include: { type: true } }>

export type UnitWithBookings = Prisma.UnitGetPayload<{
  include: { bookings: true }
}>

//export type UnitType = Prisma.UnitTypeGetPayload<>
