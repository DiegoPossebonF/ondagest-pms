import type { Prisma } from '@/app/generated/prisma'

export type UnitWithTypeAndBookings = Prisma.UnitGetPayload<{
  include: {
    type: { include: { rates: { include: { type: true } } } }
    bookings: true
  }
}>

export type UnitWithType = Prisma.UnitGetPayload<{ include: { type: true } }>

export type UnitWithBookings = Prisma.UnitGetPayload<{
  include: { bookings: true }
}>

//export type UnitType = Prisma.UnitTypeGetPayload<>
