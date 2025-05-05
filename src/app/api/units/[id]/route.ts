import { Prisma } from '@/app/generated/prisma'
import db from '@/lib/db'
import { NextResponse } from 'next/server'

// GET: Busca acomodação pelo ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const unit = await db.unit.findUnique({
      where: { id },
      include: { type: true, bookings: true }, // Inclui o UnitType relacionado
    })

    if (!unit) {
      return NextResponse.json(
        { error: 'Acomodação não encontrada!' },
        { status: 404 }
      )
    }

    return NextResponse.json(unit, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Rate' }, { status: 500 })
  }
}

// PUT: Atualiza acomodação pelo ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, typeId } = body

    const updatedUnit = await db.unit.update({
      where: { id },
      data: { name, typeId },
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
    await db.unit.delete({ where: { id } })

    return NextResponse.json(
      { message: 'Acomodação removida com sucesso!' },
      {
        status: 200,
      }
    )
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'ID não encontrado para exclusão.' },
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
