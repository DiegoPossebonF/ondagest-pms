'use client'
import { signIn } from '@/lib/auth'

async function SignInGoogle() {
  await signIn('google', { callbackUrl: '/' })
}

export default SignInGoogle
