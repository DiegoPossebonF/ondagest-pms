'use client'

import { IconDotsVertical, IconLogout } from '@tabler/icons-react'

import SignOut from '@/app/actions/auth/signout'
import type { User } from '@/app/generated/prisma'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import Logo from '@/public/images/LogoOndaGest.png'

type UserSession = Omit<User, 'createdAt' | 'updatedAt' | 'password'>

export function NavUser({ user }: { user?: UserSession }) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.image || Logo.src} alt={user?.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center justify-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="w-20 h-20 rounded-lg">
                  <AvatarImage src={user?.image || Logo.src} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="grid flex-1 px-1 py-1.5 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.name}</span>
              <span
                className={`font-medium truncate text-xs ${user?.role === 'ADMIN' ? 'text-sidebar-primary' : 'text-sidebar-accent'}`}
              >
                {user?.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {user?.email}
              </span>
            </div>
            {/*
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-600"
              onClick={() => {
                SignOut()
              }}
            >
              <IconLogout />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
