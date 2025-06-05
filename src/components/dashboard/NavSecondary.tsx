'use client'

import type * as React from 'react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import type { Icon } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
    iconFilled: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const active = (url: string) => {
    return segments[0] === url.replace('/', '')
      ? 'bg-sidebar-accent text-sidebar-primary-foreground'
      : segments.length === 0 && url === '/'
        ? 'bg-sidebar-accent text-sidebar-foreground'
        : ''
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url} className="w-full">
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`${active(item.url)}`}
                >
                  {active(item.url) && item.iconFilled && <item.iconFilled />}
                  {!active(item.url) && item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
