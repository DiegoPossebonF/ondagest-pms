'use server'
import { signIn } from '@/lib/auth'

async function SignInGoogle() {
  await signIn('google')
}

export default SignInGoogle
