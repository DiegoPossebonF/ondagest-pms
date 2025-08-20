'use server'
import db from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
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

  console.log(record)

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
