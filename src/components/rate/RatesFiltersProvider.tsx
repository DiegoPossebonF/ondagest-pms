'use client'
import {
  type RateWithUnitType,
  getRatesFilters,
} from '@/app/actions/rate/actions'
import { useIsMobile } from '@/hooks/use-mobile'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { type JSX, createContext, useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button'

/* model Rate {
    id             String     @id @default(uuid()) 
    name           String
    value          Float
    numberOfPeople Int
    type           UnitType   @relation(fields: [typeId], references: [id])
    typeId         String
    bookings       Booking[]
    active         Boolean  @default(true)
    createdAt      DateTime   @default(now())
    updatedAt      DateTime   @updatedAt
  }
*/

export type SortDirection = 'asc' | 'desc'

export type SortKey =
  | 'name'
  | 'value'
  | 'numberOfPeople'
  | 'typeId'
  | 'active'
  | 'createdAt'
  | 'updatedAt'

export interface Filters {
  name?: string
  value?: number | null
  numberOfPeople?: number | null
  typeId?: string | null
  active?: boolean | null
  createdAt?: Date | null
}

type RateFilters = {
  rates: RateWithUnitType[]
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

const RatesFiltersContext = createContext<RateFilters | undefined>(undefined)

export function RatesFiltersProvider({
  children,
}: { children: React.ReactNode }) {
  const isMobile = useIsMobile()

  const [rates, setRates] = useState<RateWithUnitType[]>([])
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [activeFilters, setActiveFilters] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')

  const perPage = 10

  const [filters, setFilters] = useState<Filters>({
    name: '',
    value: null,
    numberOfPeople: null,
    typeId: null,
    active: null,
    createdAt: null,
  })

  const fetchData = async () => {
    const result = await getRatesFilters({
      page,
      perPage,
      orderBy: sortKey,
      direction: sortDirection,
      filters,
    })

    setRates(result.data)
    setTotalPages(result.totalPages)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchData()
  }, [page, perPage, sortKey, sortDirection, filters])

  const refetch = () => fetchData()

  const resetFilters = () => {
    setFilters({
      name: '',
      value: null,
      numberOfPeople: null,
      typeId: null,
      active: null,
      createdAt: null,
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
    <RatesFiltersContext.Provider
      value={
        {
          rates,
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
        } as RateFilters
      }
    >
      {children}
    </RatesFiltersContext.Provider>
  )
}

export function useRatesFilters() {
  const context = useContext(RatesFiltersContext)
  if (!context) {
    throw new Error(
      'useRatesFilters deve ser usado dentro de RatesFiltersProvider'
    )
  }
  return context
}
