'use client'
import { getUsers } from '@/app/actions/user/actions'
import type { Role, User } from '@/app/generated/prisma'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { type JSX, createContext, useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button'

/* model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  image     String?  // URL da imagem de perfil (opcional)
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
*/

export type SortDirection = 'asc' | 'desc'

export type SortKey = 'name' | 'email' | 'role' | 'createdAt' | 'updatedAt'

export interface Filters {
  name: string
  email: string
  role: Role[]
  image?: string
}

export type UserData = Omit<User, 'password' | 'updatedAt'>

type UserFilters = {
  users: UserData[]
  error: string | null
  filters: Filters
  sortDirection: SortDirection
  activeFilters: boolean
  totalPages: number
  page: number
  perPage: number
  sortKey: SortKey
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  handleFilterChange: (key: string, value: any) => void
  resetFilters: () => void
  refetch: () => Promise<void>
  setPage: (page: number) => void
  setActiveFilters: (active: boolean) => void
  setSortDirection: (direction: SortDirection) => void
  setTotalPages: (total: number) => void
  SortHeader: ({
    label,
    column,
  }: {
    label: string
    column: SortKey
  }) => JSX.Element
}

const UsersFiltersContext = createContext<UserFilters | undefined>(undefined)

export function UsersFiltersProvider({
  children,
}: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [activeFilters, setActiveFilters] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')

  const perPage = 10

  const [filters, setFilters] = useState<Filters>({
    name: '',
    email: '',
    image: '',
    role: ['ADMIN', 'USER'],
  })

  const fetchData = async () => {
    try {
      const res = await getUsers({
        page,
        perPage,
        orderBy: sortKey,
        direction: sortDirection,
        filters,
      })

      if (res.error || !res.data) throw new Error(res.error)

      setUsers(res.data.users)
      setTotalPages(res.data.totalPages)
      setError(null)
    } catch (error) {
      setUsers([])
      setTotalPages(1)
      setError((error as Error).message)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchData()
  }, [page, perPage, sortKey, sortDirection, filters])

  const refetch = () => fetchData()

  const resetFilters = () => {
    setFilters({
      name: '',
      email: '',
      image: '',
      role: ['ADMIN', 'USER'],
    })
    setActiveFilters(false)
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value === 'ALL' ? '' : value }))
    setActiveFilters(true)
  }

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const SortHeader = ({
    label,
    column,
  }: { label: string; column: SortKey }) => (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1 text-foreground"
      onClick={() => handleSort(column)}
    >
      {label}
      {sortKey === column &&
        (sortDirection === 'asc' ? (
          <ArrowUp className="w-4 h-4" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        ))}
    </Button>
  )

  return (
    <UsersFiltersContext.Provider
      value={
        {
          users,
          error,
          filters,
          sortDirection,
          activeFilters,
          totalPages,
          page,
          perPage,
          sortKey,
          handleFilterChange,
          resetFilters,
          refetch,
          setPage,
          setActiveFilters,
          setSortDirection,
          setTotalPages,
          SortHeader,
        } as UserFilters
      }
    >
      {children}
    </UsersFiltersContext.Provider>
  )
}

export function useUsersFilters() {
  const context = useContext(UsersFiltersContext)
  if (!context) {
    throw new Error(
      'useUsersFilters deve ser usado dentro de UsersFiltersProvider'
    )
  }
  return context
}
