import { AppSidebar } from '@/components/dashboard/AppSidebar'
import { SiteHeader } from '@/components/dashboard/SiteHeader'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'
import type { ReactNode } from 'react'
import type { User } from '../generated/prisma'

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth()

  return (
    <SidebarProvider className="overflow-hidden">
      <AppSidebar user={session ? (session.user as User) : undefined} />
      <SidebarInset className="bg-sidebar overflow-hidden">
        <SiteHeader />
        <main className="flex-1 p-0 overflow-hidden bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
