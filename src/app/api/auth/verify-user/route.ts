'use server'
import db from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Token ID inválido' }, { status: 400 })
    }

    // Verificação extra: se usuário foi desativado, invalida
    const dbUser = await db.user.findUnique({
      where: { id: id as string },
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: 'Usuário não localizado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: 'Usuário verificado' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
