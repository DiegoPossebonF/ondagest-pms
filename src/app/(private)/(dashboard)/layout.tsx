import { getUserAndOrg } from '@/app/actions/utils/get-user-and-org'
import { AppSidebar } from '@/components/dashboard/AppSidebar'
import { AppProvider } from '@/contexts/AppContext'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getUserAndOrg()

  if (!user) redirect('/signin')

  return (
    <AppProvider value={{ user, organization: user.organization }}>
      <AppSidebar>{children}</AppSidebar>
    </AppProvider>
  )
}
