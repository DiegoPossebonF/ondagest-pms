import type { Prisma } from '@prisma/client'

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
