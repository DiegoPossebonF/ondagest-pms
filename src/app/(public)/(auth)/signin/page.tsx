import { SigninCard } from '@/components/auth/SigninCard'
import { SigninForm } from '@/components/auth/SigninForm'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full flex justify-center">
        <SigninCard>
          <SigninForm />
        </SigninCard>
      </div>
    </div>
  )
}
