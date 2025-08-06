'use client'
import { NavMain } from '@/components/dashboard/NavMain'
import { NavUser } from '@/components/dashboard/NavUser'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar'
import type * as React from 'react'

import type { User } from '@prisma/client'
import {
  IconBook,
  IconBookFilled,
  IconHome,
  IconHomeFilled,
  IconMapPin,
  IconMapPinFilled,
  IconSettings,
  IconSettingsFilled,
  IconUser,
  IconUserFilled,
} from '@tabler/icons-react'
import { useOrganization } from '../organization/OrganizationProvider'
import { AccessDenied } from './AccessDenied'
import { NavSecondary } from './NavSecondary'
import { OrganizationLogo } from './OrganizationLogo'
import { SiteHeader } from './SiteHeader'

const data = {
  navMain: [
    {
      title: 'Início',
      url: '/',
      icon: IconHome,
      iconFilled: IconHomeFilled,
    },
    {
      title: 'Mapa',
      url: '/map',
      icon: IconMapPin,
      iconFilled: IconMapPinFilled,
    },
    {
      title: 'Reservas',
      url: '/bookings',
      icon: IconBook,
      iconFilled: IconBookFilled,
    },
    {
      title: 'Hóspedes',
      url: '/guests',
      icon: IconUser,
      iconFilled: IconUserFilled,
    },
  ],
  navSecondary: [
    {
      title: 'Configurações',
      url: '/settings',
      icon: IconSettings,
      iconFilled: IconSettingsFilled,
    },
  ],
}

type UserSession = Omit<User, 'createdAt' | 'updatedAt' | 'password'>

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  children: React.ReactNode
  user?: UserSession
}

export function AppSidebar({ children, user, ...props }: AppSidebarProps) {
  const { organization } = useOrganization()
  return (
    <SidebarProvider defaultOpen={false} className="overflow-hidden">
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="flex flex-col justify-center h-14">
          <OrganizationLogo
            organization={{
              logo: organization?.logoUrl ?? '',
              name: organization?.name ?? '',
            }}
          />
        </SidebarHeader>
        <SidebarContent className="justify-between">
          <NavMain items={data.navMain} />
          <NavSecondary items={data.navSecondary} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-sidebar overflow-hidden">
        <SiteHeader />
        <main className="flex-1 p-0 overflow-hidden bg-background">
          {children}
        </main>
        <AccessDenied />
      </SidebarInset>
    </SidebarProvider>
  )
}
