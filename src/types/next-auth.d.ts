// biome-ignore lint/correctness/noUnusedImports: <explanation>
import NextAuth from 'next-auth'
import type { Session } from 'next-auth'

declare module 'next/server' {
  interface NextRequest {
    auth: Session | null
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      name: string
      email: string
      image?: string
    }
  }

  interface User {
    id: string
    role: string
    name: string
    email: string
    image?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    name: string
    email: string
    image?: string
  }
}
