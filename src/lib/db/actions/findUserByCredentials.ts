import db from '@/lib/db'
import type { User } from '@prisma/client'
import { compare } from 'bcryptjs'

export async function findUserByCredentials(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
      },
    })

    if (!user || !user.password) {
      return null
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return null
    }

    return user
  } catch (error) {
    console.error(error)
    return null
  }
}
