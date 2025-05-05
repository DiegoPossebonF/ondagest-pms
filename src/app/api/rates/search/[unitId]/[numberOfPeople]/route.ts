import db from '@/lib/db'
import { NextResponse } from 'next/server'

// GET: Busca hóspedes por nome
export async function GET(
  request: Request,
  { params }: { params: Promise<{ unitId: string; numberOfPeople: string }> }
) {
  try {
    const { unitId, numberOfPeople } = await params

    console.log(unitId, numberOfPeople)

    if (!unitId || !numberOfPeople) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      )
    }

    // Buscar unidade e seu tipo
    const unit = await db.unit.findUnique({
      where: { id: unitId },
      include: { type: true },
    })

    if (!unit) {
      return NextResponse.json(
        { error: 'Unidade não encontrada' },
        { status: 404 }
      )
    }

    const rate = await db.rate.findFirst({
      where: {
        typeId: unit.typeId,
        numberOfPeople: { lte: Number(numberOfPeople) },
      },
      orderBy: { numberOfPeople: 'desc' },
    })

    if (!rate) {
      return NextResponse.json(
        { error: 'Nenhuma tarifa encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ rateValue: rate.value })
  } catch (error) {
    console.error('Erro ao buscar tarifa:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor - Erro ao buscar tarifa' },
      { status: 500 }
    )
  }
}
