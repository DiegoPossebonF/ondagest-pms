import { SignupCard } from '@/components/auth/SignupCard'
import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <SignupCard>
        <SignupForm />
      </SignupCard>
    </div>
  )
}
