'use client'

import { getBookings } from '@/app/actions/booking/actions'
import { useIsMobile } from '@/hooks/use-mobile'
import type { BookingAllIncludes } from '@/types/booking'
import type { BookingStatus, PaymentStatus } from '@prisma/client'
import { ArrowDown, ArrowUp } from 'lucide-react'
import {
  type JSX,
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from 'react'
import { Button } from '../ui/button'

export type SortKey =
  | 'id'
  | 'guest'
  | 'unit'
  | 'startDate'
  | 'numberOfPeople'
  | 'status'
  | 'paymentStatus'
  | 'totalAmount'

export type SortDirection = 'asc' | 'desc'

export type Filters = {
  id: string
  guestName: string
  unitName: string
  status: BookingStatus[]
  paymentStatus: PaymentStatus
  startDate: Date | null
  endDate: Date | null
}

type BookingFilters = {
  bookings: BookingAllIncludes[]
  error: string | null
  filters: Filters
  page: number
  perPage: number
  totalPages: number
  sortKey: SortKey
  sortDirection: SortDirection
  activeFilters: boolean
  isPending: boolean
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  handleFilterChange: (key: string, value: any) => void
  handleSort: (key: SortKey) => void
  setPage: (page: number) => void
  setActiveFilters: (active: boolean) => void
  setSortDirection: (direction: SortDirection) => void
  setTotalPages: (total: number) => void
  resetFilters: () => void
  refetch: () => Promise<void>
  SortHeader: ({
    label,
    column,
  }: {
    label: string
    column: SortKey
  }) => JSX.Element
}

const BookingFiltersContext = createContext<BookingFilters | undefined>(
  undefined
)

export function BookingsFiltersProvider({
  children,
}: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [isPending, startTransition] = useTransition()
  const [bookings, setBookings] = useState<BookingAllIncludes[]>([])
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [activeFilters, setActiveFilters] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>('startDate')
  const [error, setError] = useState<string | null>(null)

  const perPage = 10

  const [filters, setFilters] = useState({
    id: '',
    guestName: '',
    unitName: '',
    status: [
      'PENDING',
      'CONFIRMED',
      'CHECKED_IN',
      'CHECKED_OUT',
      'IN_PROGRESS',
    ] as BookingStatus[],
    paymentStatus: '' as PaymentStatus,
    startDate: null,
    endDate: null,
  })

  const fetchData = async () => {
    try {
      startTransition(async () => {
        const result = await getBookings({
          page,
          perPage,
          sortKey,
          sortDirection,
          filters,
        })

        if (result.error || !result.data) throw new Error(result.error)

        setBookings(result.data.bookings)
        setTotalPages(result.data.totalPages)
        setError(null)
      })
    } catch (error) {
      setBookings([])
      setTotalPages(1)
      setError((error as Error).message)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchData()
  }, [page, sortKey, sortDirection, filters, perPage])

  const refetch = () => fetchData()

  const resetFilters = () => {
    setFilters({
      id: '',
      guestName: '',
      unitName: '',
      status: [
        'PENDING',
        'CONFIRMED',
        'CHECKED_IN',
        'CHECKED_OUT',
        'IN_PROGRESS',
      ] as BookingStatus[],
      paymentStatus: '' as PaymentStatus,
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
    <BookingFiltersContext.Provider
      value={
        {
          bookings,
          error,
          filters,
          page,
          perPage,
          totalPages,
          sortKey,
          sortDirection,
          activeFilters,
          isPending,
          handleFilterChange,
          handleSort,
          setPage,
          resetFilters,
          SortHeader,
          refetch,
        } as BookingFilters
      }
    >
      {children}
    </BookingFiltersContext.Provider>
  )
}

export function useBookingFilters() {
  const context = useContext(BookingFiltersContext)
  if (!context) {
    throw new Error(
      'useBookingFilters deve ser usado dentro de BookingFiltersProvider'
    )
  }
  return context
}
