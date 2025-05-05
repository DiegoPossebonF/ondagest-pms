'use client'
import { signoutAction } from '@/app/(public)/(auth)/actions'
import Logo from '@/public/images/LogoOndaGest.png'
import SignoutButton from '../auth/SignoutButton'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface HeaderProps {
  user?: {
    name: string
    email: string
    role: string
  }
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700 text-white">
      <div className="flex items-center space-x-2 ml-[14px]">
        <img src={Logo.src} alt="Logo" className="h-12 w-12" />
        <span className="text-lg font-semibold">OndaGest PMS</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer h-12 w-12">
            <AvatarImage src={Logo.src} alt="User Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            <div className="flex items-center space-x-2">
              <div>
                <span className="block text-sm font-semibold">
                  {user?.name}
                </span>
                <span className="block text-xs text-gray-400 font-bold">
                  {user?.email}
                </span>
                <span className="block text-xs text-gray-400">
                  {user?.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                </span>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SignoutButton
              text="Sair"
              action={signoutAction}
              className="w-full"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
