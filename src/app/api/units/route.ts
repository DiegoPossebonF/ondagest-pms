import { NextResponse } from 'next/server'

import type { Prisma } from '@/app/generated/prisma'
import db from '@/lib/db'

type UnitWithTypeAndBookings = Prisma.UnitGetPayload<{
  include: { type: true; bookings: true }
}>

export async function GET() {
  try {
    const units: UnitWithTypeAndBookings[] = await db.unit.findMany({
      include: { type: true, bookings: true },
    })

    return NextResponse.json(units.sort((a, b) => a.name.localeCompare(b.name)))
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch units' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, typeId } = body

    const existingUnit = await db.unit.findUnique({
      where: { name },
    })

    if (existingUnit) {
      return NextResponse.json(
        { error: 'Nome de unidade ja cadastrado' },
        { status: 400 }
      )
    }

    const unit = await db.unit.create({
      data: { name, typeId },
    })

    return NextResponse.json(unit, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create unit' },
      { status: 500 }
    )
  }
}
