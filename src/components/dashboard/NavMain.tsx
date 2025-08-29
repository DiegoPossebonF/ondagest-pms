'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  type Icon,
  IconCirclePlusFilled,
  IconLoader,
} from '@tabler/icons-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

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
      isMobile && setOpenMobile(false)
    })
  }

  const isButtonLoading = (href: string) => isPending && clickedUrl === href

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Reservar"
              onClick={() => handleNavigate('/bookings/new')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              disabled={isPending}
            >
              {isButtonLoading('/bookings/new') ? (
                <IconLoader className="animate-spin duration-1000" />
              ) : (
                <IconCirclePlusFilled />
              )}
              <span>Reservar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
