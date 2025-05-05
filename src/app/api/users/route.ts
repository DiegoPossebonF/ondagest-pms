import type { User } from '@/app/generated/prisma'
import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

type UserWithoutPassword = Omit<User, 'password'>

export async function GET() {
  try {
    const users: UserWithoutPassword[] = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, image, role } = body

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          error: `O e-mail ${email} já esta sendo utilizado por outro usuário!`,
        },
        { status: 400 }
      )
    }

    const user = await db.user.create({
      data: { name, email, password, image, role },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body: User = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const existingUser = await db.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado!' },
        { status: 404 }
      )
    }

    if (data.password?.length < 8) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 8 caracteres!' },
        { status: 400 }
      )
    }

    const updatedUser = await db.user.update({
      where: { id },
      data,
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do usuário não fornecido!' },
        { status: 400 }
      )
    }

    await db.user.delete({
      where: { id },
    })

    revalidatePath('/users')

    return NextResponse.json(
      { message: 'Usuário deletado com sucesso!' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao deletar usuário' },
      { status: 500 }
    )
  }
}
