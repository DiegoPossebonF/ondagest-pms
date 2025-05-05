import { Prisma } from '@/app/generated/prisma'
import db from '@/lib/db'
import { NextResponse } from 'next/server'

// GET: Busca usuário pelo ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const user = await db.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado!' },
        { status: 404 }
      )
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch User' }, { status: 500 })
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
    const { name, email, password, image, role } = body

    const updatedUser = await db.user.update({
      where: { id },
      data: { name, email, password, image, role },
    })

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Erro ao atualizar o usuário!' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
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
    await db.user.delete({ where: { id } })

    return NextResponse.json(
      { message: 'Usuário removido com sucesso!' },
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
