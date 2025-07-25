'use client'

import { type Icon, IconCirclePlusFilled, IconMail } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { usePathname, useRouter } from 'next/navigation'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    iconFilled?: Icon
  }[]
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const active = (url: string) => {
    return segments[0] === url.replace('/', '')
      ? 'bg-sidebar-accent'
      : segments.length === 0 && url === '/'
        ? 'bg-sidebar-accent'
        : ''
  }

  const handleNavigate = (href: string) => {
    router.push(href)
    isMobile && setOpenMobile(false) // Fecha o sidebar ao navegar
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Reservar"
              onClick={() => handleNavigate('/bookings/new')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Reservar</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className={`${active(item.url)}`}
                onClick={() => handleNavigate(item.url)}
              >
                {active(item.url) && item.iconFilled && <item.iconFilled />}
                {!active(item.url) && item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
