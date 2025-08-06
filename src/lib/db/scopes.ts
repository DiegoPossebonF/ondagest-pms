import type { BookingStatus } from '@prisma/client'

export const activeBookingFilter = {
  status: {
    notIn: ['CANCELLED', 'NO_SHOW'] as BookingStatus[],
  },
}

export const activeBookingStatuses = {
  status: {
    in: [
      'PENDING',
      'CONFIRMED',
      'CHECKED_IN',
      'IN_PROGRESS',
      'CHECKED_OUT',
      'FINALIZED',
    ] as BookingStatus[],
  },
}
