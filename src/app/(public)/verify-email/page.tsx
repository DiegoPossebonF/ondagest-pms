import db from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return <p>Token inválido.</p>
  }

  const user = await db.user.findFirst({
    where: {
      emailVerifyToken: token,
    },
  })

  if (!user) {
    return <p>Token inválido ou expirado.</p>
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      emailVerifyToken: null,
    },
  })

  redirect('/signin?verified=1')
}
