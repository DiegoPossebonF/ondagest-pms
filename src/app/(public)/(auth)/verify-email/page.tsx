'use server'
import db from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>
}) {
  const { token, email } = await searchParams

  if (!token || !email) {
    throw new Error('Token expirado')
  }

  // Busca token
  const record = await db.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  })

  if (!record) throw new Error('Token inválido ou expirado')

  if (record.expires < new Date()) throw new Error('Token expirado')

  // Atualiza emailVerified
  const user = await db.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  })

  if (!user) {
    throw new Error('Erro ao atualizar email verificado')
  }

  // Remove token para não ser reutilizado
  await db.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  })

  redirect('/signin?verified=1')
}
