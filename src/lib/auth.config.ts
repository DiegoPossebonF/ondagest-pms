import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { CredentialsSignin, type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import db from './db'

class EmailVerifiedError extends CredentialsSignin {
  code = 'EmailVerifiedError'
}

export const authConfig = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async credentials => {
        if (!credentials?.email || !credentials?.password) return null

        const email = String(credentials.email)
        const user = await db.user.findUnique({ where: { email } })
        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          String(credentials.password),
          user.password
        )
        if (!isValid) return null

        if (!user.emailVerified) throw new EmailVerifiedError()

        return {
          id: user.id,
          name: user.name ?? '',
          email: user.email ?? email,
          image: user.image ?? undefined,
          role: user.role ?? 'USER',
          organizationId: user.organizationId ?? undefined,
        }
      },
    }),
  ],
} satisfies NextAuthConfig
