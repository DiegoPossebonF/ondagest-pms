import { CredentialsSignin, type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

class EmailVerifiedError extends CredentialsSignin {
  code = 'EmailVerifiedError'
}

export const authConfig = {
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
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async credentials => {
        if (!credentials?.email || !credentials?.password) return null

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-credentials`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        )

        if (!res.ok) {
          const data = await res.json()

          if (data.error === 'CredentialsSignin') return null
          if (data.error === 'EmailVerifiedError')
            throw new EmailVerifiedError()
        }

        return await res.json()
      },
    }),
  ],
} satisfies NextAuthConfig
