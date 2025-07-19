import { AppSidebar } from '@/components/dashboard/AppSidebar'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { redirect } from 'next/navigation'
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

  if (!session?.user) redirect('/signin')

  const userExists = await db.user.findUnique({
    where: { id: session.user.id },
  })

  if (!userExists) redirect('/signin')

  return (
    <OrganizationServerProvider>
      <AppSidebar user={session ? (session.user as User) : undefined}>
        {children}
      </AppSidebar>
    </OrganizationServerProvider>
  )
}
