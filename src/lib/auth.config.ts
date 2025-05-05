import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { findUserByCredentials } from './findUserByCredentials'

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async credentials => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await findUserByCredentials(
          credentials.email as string,
          credentials.password as string
        )

        if (!user) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image || '',
        }
      },
    }),
  ],
} satisfies NextAuthConfig
