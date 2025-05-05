import type { User } from '@/app/generated/prisma'
import { compare } from 'bcryptjs'
import db from './db'

export async function findUserByCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const user = await db.user.findFirst({
    where: {
      email,
    },
  })

  if (!user) {
    return null
  }

  const passwordMatch = await compare(password, user.password)

  if (!passwordMatch) {
    return null
  }

  return user
}
