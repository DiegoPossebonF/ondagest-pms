import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import db from './db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  pages: {
    signIn: '/signin',
  },
  events: {
    async createUser({ user }) {
      // Checa se o usuário já tem organizationId
      const dbUser = await db.user.findUnique({
        where: { id: user.id },
      })

      if (dbUser && !dbUser.organizationId) {
        await db.user.update({
          where: { id: user.id },
          data: { role: 'OWNER' },
        })
      }
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
        token.organizationId = user.organizationId ?? null
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

        if (data.user) {
          token.role = data.user.role
          token.organizationId = data.user.organizationId ?? null
        }
        token.lastCheck = now
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
        session.user.organizationId = token.organizationId as string
      }
      return session
    },

    async signIn({ account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        // Tenta encontrar usuário existente pelo e-mail
        const existingUser = await db.user.findUnique({
          where: { email: profile.email },
        })

        if (existingUser) {
          if (!existingUser?.image) {
            await db.user.update({
              where: { id: existingUser.id },
              data: { image: profile.picture },
            })
          }
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
