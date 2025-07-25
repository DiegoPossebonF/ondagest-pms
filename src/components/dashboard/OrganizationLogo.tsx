'use client'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { IconPhotoOff } from '@tabler/icons-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export function OrganizationLogo({
  organization,
}: {
  organization: {
    name: string
    logo: string
  }
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href={'/'} className="w-full">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar"
          >
            <Avatar className="h-8 w-8 rounded-md bg-sidebar">
              <AvatarImage src={organization.logo} alt={organization.logo} />
              <AvatarFallback className="rounded-md">
                <IconPhotoOff className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{organization.name}</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
