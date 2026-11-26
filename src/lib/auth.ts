import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import db from './db'

const authOptions = {
  ...authConfig,
  pages: {
    signIn: '/signin',
    error: '/error',
  },
  callbacks: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
        token.role = user.role
        token.organizationId = user.organizationId
        token.roleCheckedAt = Date.now()
      } else if (token.id) {
        // Re-sincroniza o papel (e dados básicos) do banco a cada ~5 min,
        // para que mudanças de role/organização reflitam sem esperar expirar.
        const lastChecked = token.roleCheckedAt as number | undefined
        if (!lastChecked || Date.now() - lastChecked > 5 * 60 * 1000) {
          const dbUser = await db.user.findUnique({
            where: { id: token.id },
            select: {
              role: true,
              organizationId: true,
              name: true,
              email: true,
              image: true,
            },
          })
          if (dbUser) {
            token.role = dbUser.role ?? 'USER'
            token.organizationId = dbUser.organizationId ?? undefined
            token.name = dbUser.name ?? token.name
            token.email = dbUser.email ?? token.email
            token.image = dbUser.image ?? token.image
          }
          token.roleCheckedAt = Date.now()
        }
      }

      return token
    },

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    session: async ({ session, token }: any) => {
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

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    signIn: async ({ account, profile }: any) => {
      if (account?.provider === 'google' && profile?.email) {
        // Tenta encontrar usuário existente pelo e-mail (com accounts p/ saber se já usa Google)
        const existingUser = await db.user.findUnique({
          where: { email: profile.email },
          include: { accounts: true },
        })

        if (existingUser) {
          const isGoogleUser = existingUser.accounts.some(
            a => a.provider === 'google'
          )

          // Bloqueia account takeover: só vincula a conta Google se o e-mail já
          // foi verificado ou se o usuário já possui login Google.
          if (!existingUser.emailVerified && !isGoogleUser) {
            return '/error'
          }

          if (!existingUser.image) {
            await db.user.update({
              where: { id: existingUser.id },
              data: { image: profile.picture },
            })
          }
        } else {
          // 1) Cria organização vazia
          const org = await db.organization.create({
            data: {
              name: 'Nova Organização',
              email: profile.email,
              isSetupCompleted: false, // campo que controla o setup inicial
            },
          })

          // 2) Cria usuário vinculado (Google já verifica o e-mail)
          await db.user.create({
            data: {
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              role: 'OWNER',
              organizationId: org.id,
              emailVerified: new Date(),
            },
          })
        }
      }

      return true
    },
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
} as any

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions) as any
