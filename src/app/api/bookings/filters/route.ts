import db from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { guestQuery, unitId, skip = 0, take = 10 } = body

  const bookings = await db.booking.findMany({
    where: {
      ...(guestQuery && {
        guest: {
          OR: [
            { name: { contains: guestQuery, mode: 'insensitive' } },
            { email: { contains: guestQuery, mode: 'insensitive' } },
          ],
        },
      }),
      ...(unitId && { unitId }),
    },
    include: {
      guest: true,
      unit: true,
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  })

  return NextResponse.json(bookings)
}
