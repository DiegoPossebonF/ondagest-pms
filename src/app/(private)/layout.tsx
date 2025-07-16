import { AppSidebar } from '@/components/dashboard/AppSidebar'
import { auth } from '@/lib/auth'
import type { ReactNode } from 'react'
import type { User } from '../generated/prisma'
import OrganizationServerProvider from './organization-provider'

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth()

  return (
    <OrganizationServerProvider>
      <AppSidebar user={session ? (session.user as User) : undefined}>
        {children}
      </AppSidebar>
    </OrganizationServerProvider>
  )
}
