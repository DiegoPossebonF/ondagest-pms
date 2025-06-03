'use client'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export function EnterpriseLogo({
  enterprise,
}: {
  enterprise: {
    name: string
    logo: string
    subname: string
  }
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href={'/'} className="w-full">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={enterprise.logo} alt={enterprise.logo} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{enterprise.name}</span>
              <span className="truncate text-xs">{enterprise.subname}</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
