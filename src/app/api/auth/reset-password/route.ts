'use server'
import db from '@/lib/db'
import {
  checkRateLimit,
  getClientIp,
  resetPasswordLimiter,
} from '@/lib/rate-limit'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const ip = await getClientIp(req.headers)
  const { success: allowed } = await checkRateLimit(
    resetPasswordLimiter,
    `reset:${ip}`
  )
  if (!allowed) {
    return Response.json(
      { error: 'Muitas solicitações. Tente novamente mais tarde.' },
      { status: 429 }
    )
  }

  const { token, email, password, confirmPassword } = await req.json()

  if (!token || !email || !password || !confirmPassword) {
    return Response.json(
      { error: 'Token, email, senha e senha de confirmação são obrigatórios' },
      { status: 400 }
    )
  }

  if (password !== confirmPassword) {
    return Response.json({ error: 'Senhas não conferem' }, { status: 400 })
  }

  const record = await db.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  })

  if (!record || record.expires < new Date()) {
    return Response.json(
      { error: 'Token inválido ou expirado' },
      { status: 400 }
    )
  }

  const hashed = await bcrypt.hash(password, 10)

  await db.user.update({
    where: { email: record.identifier },
    data: { password: hashed },
  })

  await db.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  })

  return Response.json({ success: true })
}
