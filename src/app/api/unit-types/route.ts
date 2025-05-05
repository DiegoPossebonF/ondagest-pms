import db from '@/lib/db'
import { NextResponse } from 'next/server'

// GET: Lista todos os UnitTypes
export async function GET() {
  try {
    const unitTypes = await db.unitType.findMany()
    return NextResponse.json(unitTypes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch UnitTypes' },
      { status: 500 }
    )
  }
}

// POST: Cria um novo UnitType
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, numberOfPeople } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const newUnitType = await db.unitType.create({
      data: {
        name,
        description,
        numberOfPeople,
      },
    })

    return NextResponse.json(newUnitType, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create UnitType' },
      { status: 500 }
    )
  }
}
