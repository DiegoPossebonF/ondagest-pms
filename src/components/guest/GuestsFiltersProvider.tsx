'use client'
import { getGuests } from '@/app/actions/guest/actions'
import type { Guest } from '@/app/generated/prisma'
import { useIsMobile } from '@/hooks/use-mobile'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { type JSX, createContext, useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button'

export type SortDirection = 'asc' | 'desc'

export type SortKey =
  | 'id'
  | 'name'
  | 'email'
  | 'phone'
  | 'cpf'
  | 'city'
  | 'carPlate'
  | 'createdAt'

export interface Filters {
  name: string
  email: string
  phone: string
  cpf: string
  city: string
  carPlate: string
  startDate: Date | null
  endDate: Date | null
}

type GuestFilters = {
  guests: Guest[]
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

const GuestFiltersContext = createContext<GuestFilters | undefined>(undefined)

export function GuestsFiltersProvider({
  children,
}: { children: React.ReactNode }) {
  const isMobile = useIsMobile()

  const [guests, setGuests] = useState<Guest[]>([])
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [activeFilters, setActiveFilters] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [error, setError] = useState<string | null>(null)

  const perPage = 10

  const [filters, setFilters] = useState<Filters>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    city: '',
    carPlate: '',
    startDate: null,
    endDate: null,
  })

  const fetchData = async () => {
    try {
      const res = await getGuests({
        page,
        perPage,
        orderBy: sortKey,
        direction: sortDirection,
        filters,
      })

      if (res.error || !res.data) throw new Error(res.error)

      setGuests(res.data.guests)
      setTotalPages(res.data.totalPages)
      setError(null)
    } catch (error) {
      setGuests([])
      setTotalPages(1)
      setError((error as Error).message)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchData()
  }, [page, perPage, sortKey, sortDirection, filters])

  const refetch = async () => await fetchData()

  const resetFilters = () => {
    setFilters({
      name: '',
      email: '',
      phone: '',
      cpf: '',
      city: '',
      carPlate: '',
      startDate: null,
      endDate: null,
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
    <GuestFiltersContext.Provider
      value={
        {
          guests,
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
        } as GuestFilters
      }
    >
      {children}
    </GuestFiltersContext.Provider>
  )
}

export function useGuestsFilters() {
  const context = useContext(GuestFiltersContext)
  if (!context) {
    throw new Error(
      'useGuestFilters deve ser usado dentro de GuestFiltersProvider'
    )
  }
  return context
}
