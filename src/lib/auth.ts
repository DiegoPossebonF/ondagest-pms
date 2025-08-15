import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import db from './db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  pages: {
    signIn: '/signin',
  },
  events: {
    async signIn(message) {
      console.log('EVENT signIn', message)
    },
    async signOut(message) {
      console.log('EVENT signOut', message)
    },
  },
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
          console.error('ERROR verify-user', data.error)
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

    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        if (user && profile.picture) {
          await db.user.update({
            where: { id: user.id },
            data: { image: profile.picture },
          })
        }
        // Tenta encontrar usuário existente pelo e-mail
        const existingUser = await db.user.findUnique({
          where: { email: profile.email },
        })

        if (existingUser) {
          // Verifica se já existe conta do provider
          const existingAccount = await db.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: account.provider,
            },
          })

          if (!existingAccount) {
            // Cria automaticamente a conta OAuth vinculada
            await db.account.create({
              data: {
                userId: existingUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
              },
            })
          }
        }
      }

      return true
    },
  },
})
