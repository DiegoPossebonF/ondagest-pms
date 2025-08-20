import { SigninCard } from '@/components/auth/SigninCard'
import type { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function SignInLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full flex justify-center">
        <SigninCard>{children}</SigninCard>
      </div>
    </div>
  )
}
