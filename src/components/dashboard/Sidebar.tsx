'use client'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  BedDouble,
  BookMarked,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  DollarSign,
  DoorOpen,
  HeartHandshake,
  Home,
  MapIcon,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SidebarProps {
  userRole?: string
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
  const [isMenuAdmMinimized, setIsMenuAdmMinimized] = useState(true)

  const isLargeScreen = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    // Se a tela for menor que lg, minimize
    setIsSidebarMinimized(!isLargeScreen)
  }, [isLargeScreen])

  return (
    <aside
      className={`transition-all duration-300 bg-gray-900 text-white ${
        isSidebarMinimized ? 'w-22' : 'w-64'
      } flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span
          className={`font-semibold transition-opacity ml-[18px] ${isSidebarMinimized ? 'hidden' : 'block'}`}
        >
          Menu
        </span>
        <Button
          className="text-white"
          onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
        >
          {isSidebarMinimized ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <Link
          href="/"
          className={`flex items-center py-2 px-4 rounded ${pathname === '/' ? 'bg-gray-700' : ''}`}
        >
          <Home size={20} />
          <span className={`${isSidebarMinimized ? 'hidden' : 'block'} ml-4`}>
            Início
          </span>
        </Link>
        <Link
          href="/map"
          className={`flex items-center py-2 px-4 rounded ${pathname === '/map' ? 'bg-gray-700' : ''}`}
        >
          <MapIcon size={20} />
          <span className={`${isSidebarMinimized ? 'hidden' : 'block'} ml-4`}>
            Mapa
          </span>
        </Link>
        <Link
          href="/booking"
          className={`flex items-center py-2 px-4 rounded ${pathname === '/booking' ? 'bg-gray-700' : ''}`}
        >
          <BookMarked size={20} />
          <span className={`${isSidebarMinimized ? 'hidden' : 'block'} ml-4`}>
            Reservas
          </span>
        </Link>
        <Link
          href="/guest"
          className={`flex items-center py-2 px-4 rounded ${pathname === '/guest' ? 'bg-gray-700' : ''}`}
        >
          <HeartHandshake size={20} />
          <span className={`${isSidebarMinimized ? 'hidden' : 'block'} ml-4`}>
            Hóspedes
          </span>
        </Link>
      </nav>
      <div
        className={`${userRole ? (userRole === 'ADMIN' ? 'block' : 'hidden') : 'hidden'}`}
        suppressHydrationWarning
      >
        <div className="flex items-center justify-between p-4 border-b border-t border-gray-700">
          <span
            className={`font-semibold transition-opacity ml-[18px] ${isSidebarMinimized ? 'hidden' : 'block'}`}
          >
            Configurações
          </span>
          <Button
            className="text-white"
            onClick={() => setIsMenuAdmMinimized(!isMenuAdmMinimized)}
          >
            {isMenuAdmMinimized ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </Button>
        </div>
        <nav
          className={`flex flex-col space-y-2 p-4 ${isMenuAdmMinimized ? 'hidden' : 'block'}`}
        >
          <Link
            href="/admin/users"
            className={`flex items-center py-2 px-4 rounded ${pathname === '/users' ? 'bg-gray-700' : ''}`}
          >
            <Users size={20} />
            <span className={`${isSidebarMinimized ? 'hidden' : 'block'} ml-4`}>
              Usuários
            </span>
          </Link>
          <Link
            href="/admin/units"
            className={`flex items-center py-2 px-4 rounded ${pathname === '/units' ? 'bg-gray-700' : ''}`}
          >
            <DoorOpen size={20} />
            <span className={`${isSidebarMinimized ? 'hidden' : 'block'} ml-4`}>
              Acomodações
            </span>
          </Link>
          <Link
            href="/admin/unit-types"
            className={`flex items-center py-2 px-4 rounded ${pathname === '/unit-types' ? 'bg-gray-700' : ''}`}
          >
            <BedDouble size={20} />
            <span className={`${isSidebarMinimized ? 'hidden' : 'block'} ml-4`}>
              Tipos de Acomodação
            </span>
          </Link>
          <Link
            href="/admin/rates"
            className={`flex items-center py-2 px-4 rounded ${pathname === '/rates' ? 'bg-gray-700' : ''}`}
          >
            <DollarSign size={20} />
            <span className={`${isSidebarMinimized ? 'hidden' : 'block'} ml-4`}>
              Tarifas
            </span>
          </Link>
        </nav>
      </div>
    </aside>
  )
}
