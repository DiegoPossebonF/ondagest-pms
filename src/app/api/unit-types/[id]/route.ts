import { Prisma } from '@/app/generated/prisma'
import db from '@/lib/db'
import { NextResponse } from 'next/server'

// GET: Busca tipo de acomodação pelo ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const unitType = await db.unitType.findUnique({
      where: { id },
      include: { units: true, rates: true }, // Inclui as acomodações e os Precos
    })

    if (!unitType) {
      return NextResponse.json(
        { error: 'Tipo de Acomodação não encontrada!' },
        { status: 404 }
      )
    }

    return NextResponse.json(unitType, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch UnitType' },
      { status: 500 }
    )
  }
}

// PUT: Atualiza tipo de acomodação pelo ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, numberOfPeople } = body

    const updatedUnit = await db.unitType.update({
      where: { id },
      data: { name, description, numberOfPeople },
    })

    return NextResponse.json(updatedUnit, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update unit' },
      { status: 500 }
    )
  }
}

// DELETE: Remove acomodação pelo ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params

    await db.unitType.delete({ where: { id } })

    return NextResponse.json(
      { message: 'Tipo de acomodação removida com sucesso!' },
      {
        status: 200,
      }
    )
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Tipo de acomodação não encontrado para exclusão.' },
          { status: 404 }
        )
      }

      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          {
            error:
              'Não foi possível excluir devido a dependências. Primeiro exclua todos os dados relacionados.',
          },
          { status: 400 }
        )
      }
    }

    // Tratamento genérico para outros erros
    return NextResponse.json(
      { error: 'Erro interno ao excluir o registro.' },
      { status: 500 }
    )
  }
}
