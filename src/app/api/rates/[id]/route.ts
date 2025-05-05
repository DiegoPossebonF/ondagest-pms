import { Prisma } from '@/app/generated/prisma'
import db from '@/lib/db'
import { NextResponse } from 'next/server'

// GET: Busca Rate pelo ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const rate = await db.rate.findUnique({
      where: { id },
      include: { type: true }, // Inclui o UnitType relacionado
    })

    if (!rate) {
      return NextResponse.json({ error: 'Rate not found' }, { status: 404 })
    }

    return NextResponse.json(rate)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Rate' }, { status: 500 })
  }
}

// PUT: Atualiza Rate pelo ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, value, typeId, numberOfPeople } = body

    const existingRate = await db.rate.findFirst({
      where: {
        AND: [
          {
            name,
            numberOfPeople,
          },
          { name, typeId },
        ],
        NOT: { id },
      },
    })

    if (existingRate) {
      return NextResponse.json(
        { error: 'Tarifa ja cadastrada!' },
        { status: 400 }
      )
    }

    const updatedRate = await db.rate.update({
      where: { id },
      data: { name, value, typeId, numberOfPeople },
    })

    return NextResponse.json(updatedRate, { status: 200 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Erro ao atualizar a taxa:', error)
      return NextResponse.json(
        { error: 'Erro interno ao atualizar a taxa.' },
        { status: 500 }
      )
    }
    return NextResponse.json({ erro: 'Erro inesperado.' }, { status: 500 })
  }
}

// DELETE: Remove Rate pelo ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    await db.rate.delete({ where: { id } })

    return NextResponse.json({ message: 'Rate deleted successfully' })
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
