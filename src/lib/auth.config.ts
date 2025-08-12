import { CredentialsSignin, type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { findUserByCredentials } from './db/actions/findUserByCredentials'

class EmailVerifiedError extends CredentialsSignin {
  code = 'EmailVerifiedError'
}

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async credentials => {
        if (!credentials?.email || !credentials?.password) return null

        const user = await findUserByCredentials(
          credentials.email as string,
          credentials.password as string
        )

        if (!user) {
          return null
        }

        if (!user.emailVerified) {
          throw new EmailVerifiedError()
        }

        return {
          id: user.id,
          name: user.name || '',
          email: user.email,
          role: user.role,
          image: user.image || '',
        }
      },
    }),
  ],
} satisfies NextAuthConfig
