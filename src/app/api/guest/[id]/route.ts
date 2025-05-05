import db from '@/lib/db'
import { NextResponse } from 'next/server'

// GET: Busca guest pelo ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const guest = await db.guest.findUnique({
      where: { id },
      include: { bookings: true }, // Inclui o UnitType relacionado
    })

    if (!guest) {
      return NextResponse.json(
        { error: 'Hóspede nao encontrado!' },
        { status: 404 }
      )
    }

    return NextResponse.json(guest, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Rate' }, { status: 500 })
  }
}

// PUT: Atualiza guest pelo ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, phone } = body

    const updatedGuest = await db.guest.update({
      where: { id },
      data: { name, email, phone },
    })

    return NextResponse.json(updatedGuest, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar o hóspede' },
      { status: 500 }
    )
  }
}

// DELETE: Remove guest pelo ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    await db.guest.delete({ where: { id } })

    return NextResponse.json({ message: 'Hóspede removido com sucesso!' })
  } catch (error) {
    // Tratamento genérico para outros erros
    return NextResponse.json(
      { error: 'Erro ao remover o hóspede' },
      { status: 500 }
    )
  }
}
