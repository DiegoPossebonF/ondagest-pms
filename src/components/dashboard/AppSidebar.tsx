'use client'
import type * as React from 'react'

import { EnterpriseLogo } from '@/components/dashboard/EnterpriseLogo'
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

import type { User } from '@/app/generated/prisma'
import logo from '@/public/images/LogoOndaGest.png'
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
import { AccessDenied } from './AccessDenied'
import { NavSecondary } from './NavSecondary'
import { SiteHeader } from './SiteHeader'

// This is sample data.
const data = {
  enterprise: {
    name: 'OndaGest',
    logo: logo.src,
    subname: 'PMS',
  },
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
  return (
    <SidebarProvider className="overflow-hidden">
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <EnterpriseLogo enterprise={data.enterprise} />
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
