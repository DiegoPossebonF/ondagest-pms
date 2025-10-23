import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import db from './db'

const authOptions = {
  ...authConfig,
  pages: {
    signIn: '/signin',
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
        // Tenta encontrar usuário existente pelo e-mail
        let dbUser = await db.user.findUnique({
          where: { email: profile.email },
        })

        if (dbUser) {
          if (!dbUser?.image) {
            await db.user.update({
              where: { id: dbUser.id },
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

          // 2) Cria usuário vinculado
          dbUser = await db.user.create({
            data: {
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              role: 'OWNER',
              organizationId: org.id,
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
