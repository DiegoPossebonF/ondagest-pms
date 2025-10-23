import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

interface SettingsLayoutProps {
  children: ReactNode
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const session = await auth()
  if (
    !session ||
    (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')
  ) {
    redirect('/?error=unauthorized')
  }

  return <>{children}</>
}
