'use client'

import {
  BookOpen,
  Bot,
  Frame,
  // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react'
import type * as React from 'react'

import { NavMain } from '@/components/dashboard/NavMain'
import { NavUser } from '@/components/dashboard/NavUser'
import { TeamSwitcher } from '@/components/dashboard/TeamSwitcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

import logo from '@/public/images/LogoOndaGest.png'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: logo.src,
  },
  teams: [
    {
      name: 'OndaGest',
      logo: logo.src,
      plan: 'PMS',
    },
    {
      name: 'Acme Corp.',
      logo: logo.src,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: logo.src,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Início',
          url: '/',
        },
        {
          title: 'Mapa',
          url: '/map',
        },
        {
          title: 'Reservas',
          url: '/booking',
        },
        {
          title: 'Hóspedes',
          url: '/guest',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
