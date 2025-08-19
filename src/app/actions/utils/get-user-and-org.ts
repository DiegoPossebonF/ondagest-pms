// src/actions/get-user-and-org.ts
'use server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'

export async function getUserAndOrg() {
  const session = await auth()
  if (!session?.user) return null

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { organization: true },
  })

  return user
}
