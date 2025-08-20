'use server'

import { randomUUID } from 'node:crypto'
import { sendVerificationResetPassword } from '@/app/actions/auth/send-verification-reset-password'
import db from '@/lib/db'

export async function POST(req: Request) {
  const { email } = await req.json()

  const user = await db.user.findUnique({ where: { email } })
  if (!user) {
    return Response.json({ success: true }) // sempre retorna sucesso p/ evitar user enumeration
  }

  const token = randomUUID()
  const expires = new Date(Date.now() + 1000 * 60 * 60) // 1h

  const record = await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  })

  if (!record) {
    return Response.json({ success: true }) // sempre retorna sucesso p/ evitar user enumeration
  }

  await sendVerificationResetPassword(email, user.name as string, token)

  return Response.json({ success: true })
}
