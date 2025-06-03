'use server'
import { signOut } from '@/lib/auth'

async function SignOut() {
  await signOut()
}

export default SignOut
