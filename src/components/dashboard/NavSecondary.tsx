'use client'

import type * as React from 'react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { type Icon, IconLoader } from '@tabler/icons-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

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
  const { isMobile, setOpenMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const [isPending, startTransition] = useTransition()
  const [clickedUrl, setClickedUrl] = useState<string | null>(null)

  const active = (url: string) => {
    return segments[0] === url.replace('/', '')
      ? 'bg-sidebar-accent'
      : segments.length === 0 && url === '/'
        ? 'bg-sidebar-accent'
        : ''
  }

  const handleNavigate = (href: string) => {
    setClickedUrl(href)
    startTransition(() => {
      router.push(href)
      isMobile && setOpenMobile(false) // Fecha o sidebar ao navegar
    })
  }

  const isButtonLoading = (href: string) => isPending && clickedUrl === href

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className={`${!isButtonLoading(item.url) && active(item.url)}`}
                onClick={() => handleNavigate(item.url)}
                disabled={isPending}
              >
                {!isButtonLoading(item.url) &&
                  active(item.url) &&
                  item.iconFilled && <item.iconFilled />}
                {!isButtonLoading(item.url) &&
                  !active(item.url) &&
                  item.icon && <item.icon />}
                {isButtonLoading(item.url) && (
                  <IconLoader className={'animate-spin duration-1000'} />
                )}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
