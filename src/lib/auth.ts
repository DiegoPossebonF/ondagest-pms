import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    jwt: async ({ token, user }) => {
      const now = Date.now()

      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.image = user.image
        token.role = user.role
        token.lastCheck = now
      }

      if (
        !token.lastCheck ||
        now - (token.lastCheck as number) > 5 * 60 * 1000
      ) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-user`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: token.id,
            }),
          }
        )

        const data = await res.json()

        if (data.error) {
          return null
        }
      }

      return token
    },

    session: async ({ session, token }) => {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.image as string
        session.user.role = token.role as string
      }
      return session
    },

    async signIn({ user, account }) {
      // Se quiser impedir certos logins, tratar aqui
      return true
    },
  },
})
