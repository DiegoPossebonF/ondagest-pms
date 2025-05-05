import { Prisma } from '@/app/generated/prisma'
import db from '@/lib/db'
import type { Rate } from '@/types/rate'
import { NextResponse } from 'next/server'

// GET: Lista todos os Rates
export async function GET() {
  try {
    const rates: Rate[] = await db.rate.findMany({
      include: { type: true }, // Inclui o UnitType relacionado
    })

    if (!rates) {
      return NextResponse.json(
        { error: 'Tarifas não localizadas!' },
        { status: 404 }
      )
    }

    let sortRates = rates.sort((a, b) => {
      if (a.numberOfPeople && b.numberOfPeople) {
        return a.numberOfPeople - b.numberOfPeople
      }
      return 0
    })

    sortRates = sortRates.sort((a, b) => a.name.localeCompare(b.name))

    sortRates = sortRates.sort((a, b) => a.type.name.localeCompare(b.type.name))

    return NextResponse.json(sortRates, { status: 200 })
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

    const { typeId, name, value, numberOfPeople } = body

    const existingRate = await db.rate.findFirst({
      where: {
        AND: [
          {
            name,
            numberOfPeople,
          },
          { name, typeId },
        ],
      },
    })

    if (existingRate) {
      return NextResponse.json(
        { error: 'Tarifa ja cadastrada!' },
        { status: 400 }
      )
    }

    const newRate = await db.rate.create({
      data: {
        typeId,
        name,
        numberOfPeople,
        value,
      },
    })

    return NextResponse.json(newRate, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          {
            error: 'Tarifa já cadastrada com o mesmo número de pessoas!',
          },
          { status: 400 }
        )
      }
    }
    return NextResponse.json(
      { error: 'Failed to create Rate' },
      { status: 500 }
    )
  }
}
