import db from '@/lib/db'
import { NextResponse } from 'next/server'

// GET: Busca hóspedes por nome
export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params

    //console.log(name)

    if (!name) {
      return NextResponse.json(
        { error: 'O parâmetro "name" é obrigatório!' },
        { status: 400 }
      )
    }

    const guests = await db.guest.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(guests, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar hóspedes' },
      { status: 500 }
    )
  }
}
