import type { Guest } from '@/app/generated/prisma'
import db from '@/lib/db'
import { NextResponse } from 'next/server'

// GET: Lista todos os Rates
export async function GET() {
  try {
    const guests: Guest[] = await db.guest.findMany({
      include: { bookings: true }, // Inclui o UnitType relacionado
      orderBy: { name: 'asc' },
    })

    if (!guests) {
      return NextResponse.json(
        { error: 'Hóspedes não localizados!' },
        { status: 404 }
      )
    }

    return NextResponse.json(guests, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Rates' },
      { status: 500 }
    )
  }
}

// POST: Cria um novo Rate
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone } = body

    const guest = await db.guest.create({
      data: {
        name,
        email,
        phone,
      },
    })

    return NextResponse.json(guest, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar o hóspede!' },
      { status: 500 }
    )
  }
}
