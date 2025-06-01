import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import { auth } from '@/lib/auth'
import type { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth()

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header user={session ? session.user : undefined} />
      <div className="flex flex-1 max-h-screen[calc(100vh-81px)] overflow-y-auto">
        {/* Sidebar */}
        <Sidebar userRole={session?.user.role} />
        {/* Main Content */}
        <main className="flex-1 p-0 bg-gray-100 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
