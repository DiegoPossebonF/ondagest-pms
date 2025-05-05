import { Prisma } from '@/app/generated/prisma'
import db from '@/lib/db'
import { NextResponse } from 'next/server'

// GET: Busca pagamento pelo ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const payment = await db.payment.findUnique({
      where: { id },
      include: { booking: true },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado!' },
        { status: 404 }
      )
    }

    return NextResponse.json(payment, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Payment' },
      { status: 500 }
    )
  }
}

// PUT: Atualiza pagamento pelo ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const { amount, paidAt, paymentType } = await request.json()

    if (typeof id !== 'string') {
      return NextResponse.json(
        { error: 'ID must be a string' },
        { status: 400 }
      )
    }

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    if (typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Amount must be a number' },
        { status: 400 }
      )
    }

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 })
    }

    const updatedPayment = await db.payment.update({
      where: { id },
      data: { amount, paidAt, paymentType },
    })

    return NextResponse.json(updatedPayment, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update unit' },
      { status: 500 }
    )
  }
}

// DELETE: Remove pagamento pelo ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    await db.payment.delete({ where: { id } })

    return NextResponse.json(
      { message: 'Pagamento removido com sucesso!' },
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
