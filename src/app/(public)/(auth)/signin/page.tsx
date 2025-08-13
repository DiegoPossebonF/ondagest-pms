import { SigninCard } from '@/components/auth/SigninCard'
import { SigninForm } from '@/components/auth/SigninForm'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>
}) {
  const verified = (await searchParams).verified === '1'

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full flex justify-center">
        <SigninCard verified={verified}>
          <SigninForm />
        </SigninCard>
      </div>
    </div>
  )
}
