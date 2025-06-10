'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import dayjs from 'dayjs'
import { useState } from 'react'
import 'dayjs/locale/pt-br'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_PAYMENT_COLORS,
  STATUS_PAYMENT_LABELS,
  formatCurrency,
} from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import {
  IconArrowsSort,
  IconFilterEdit,
  IconFilterX,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-react'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { ArrowDown, ArrowUp } from 'lucide-react'
import Link from 'next/link'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { BookingsFilters } from './BookingsFilters'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

dayjs.locale('pt-br')

interface BookingListProps {
  bookings: BookingAllIncludes[]
}

type SortKey =
  | 'guest'
  | 'unit'
  | 'startDate'
  | 'numberOfPeople'
  | 'status'
  | 'paymentStatus'
  | 'totalAmount'

type SortDirection = 'asc' | 'desc'

export function BookingsList({ bookings }: BookingListProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [sortKey, setSortKey] = useState<SortKey>('startDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [activeFilters, setActiveFilters] = useState(false)

  const [filters, setFilters] = useState({
    guestName: '',
    unitName: '',
    status: '',
    paymentStatus: '',
    startDate: null,
    endDate: null,
  })

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

  const filteredBookings = bookings.filter(b => {
    return (
      (!filters.guestName ||
        b.guest.name.toLowerCase().includes(filters.guestName.toLowerCase())) &&
      (!filters.unitName ||
        b.unit.name.toLowerCase().includes(filters.unitName.toLowerCase())) &&
      (!filters.status || b.status === filters.status) &&
      (!filters.paymentStatus || b.paymentStatus === filters.paymentStatus) &&
      (!filters.startDate ||
        dayjs(b.startDate).isSameOrAfter(dayjs(filters.startDate))) &&
      (!filters.endDate ||
        dayjs(b.endDate).isSameOrBefore(dayjs(filters.endDate)))
    )
  })

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let aValue = a[sortKey as keyof BookingAllIncludes] as any
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let bValue = b[sortKey as keyof BookingAllIncludes] as any

    if (sortKey === 'guest') {
      aValue = a.guest.name
      bValue = b.guest.name
    } else if (sortKey === 'unit') {
      aValue = a.unit.name
      bValue = b.unit.name
    } else if (sortKey === 'startDate') {
      aValue = new Date(a.startDate).getTime()
      bValue = new Date(b.startDate).getTime()
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="self-start">
                <IconFilterEdit className="w-4 h-4" /> Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-50">
              <BookingsFilters
                filters={filters}
                onChange={handleFilterChange}
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <IconArrowsSort className="w-4 h-4" /> Ordenar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-50  flex flex-row gap-2">
              <Select
                value={sortKey}
                onValueChange={(value: SortKey) => setSortKey(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="guest">Hóspede</SelectItem>
                  <SelectItem value="unit">Acomodação</SelectItem>
                  <SelectItem value="startDate">Data</SelectItem>
                  <SelectItem value="numberOfPeople">Pessoas</SelectItem>
                  <SelectItem value="status">Status da reserva</SelectItem>
                  <SelectItem value="paymentStatus">Pagamento</SelectItem>
                  <SelectItem value="totalAmount">Total</SelectItem>
                </SelectContent>
              </Select>

              <Button
                value={sortDirection}
                variant="outline"
                size="icon"
                onClick={() =>
                  setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
                }
              >
                {sortDirection === 'asc' ? (
                  <IconSortAscending />
                ) : (
                  <IconSortDescending />
                )}
              </Button>
            </PopoverContent>
          </Popover>
          {activeFilters && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setFilters({
                  guestName: '',
                  unitName: '',
                  status: '',
                  paymentStatus: '',
                  startDate: null,
                  endDate: null,
                })
                setActiveFilters(false)
              }}
            >
              <IconFilterX className="w-4 h-4" />
            </Button>
          )}
        </div>

        {sortedBookings.map(booking => (
          <Card key={booking.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{booking.guest.name}</CardTitle>
              <Badge className={`${STATUS_COLORS[booking.status]}`}>
                {STATUS_LABELS[booking.status]}
              </Badge>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>Acomodação: {booking.unit.name}</div>
              <div>
                Período: {dayjs(booking.startDate).format('DD/MM')} -{' '}
                {dayjs(booking.endDate).format('DD/MM')}
              </div>
              <div>Pessoas: {booking.numberOfPeople}</div>
              <div>
                Pagamento:
                <Badge
                  className={`ml-2 ${STATUS_PAYMENT_COLORS[booking.paymentStatus]}`}
                >
                  {STATUS_PAYMENT_LABELS[booking.paymentStatus]}
                </Badge>
              </div>
              <div>Total: {formatCurrency(booking.totalAmount)}</div>
              <div className="pt-2">
                <Link
                  href={`/bookings/${booking.id}`}
                  title="Detalhes da reserva"
                >
                  <Button size="sm" variant="outline">
                    Detalhes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const SortHeader = ({
    label,
    column,
  }: { label: string; column: SortKey }) => (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1"
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
    <div className="space-y-4">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="self-start">
              <IconFilterEdit className="w-4 h-4" /> Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent className="z-50">
            <BookingsFilters filters={filters} onChange={handleFilterChange} />
          </PopoverContent>
        </Popover>

        {activeFilters && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setFilters({
                guestName: '',
                unitName: '',
                status: '',
                paymentStatus: '',
                startDate: null,
                endDate: null,
              })
              setActiveFilters(false)
            }}
          >
            <IconFilterX className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-2 py-1">
                <SortHeader label="Hóspede" column="guest" />
              </th>
              <th className="px-2 py-1">
                <SortHeader label="Acomodação" column="unit" />
              </th>
              <th className="px-2 py-1">
                <SortHeader label="Período" column="startDate" />
              </th>
              <th className="px-2 py-1">
                <SortHeader label="Pessoas" column="numberOfPeople" />
              </th>
              <th className="px-2 py-1">
                <SortHeader label="Status" column="status" />
              </th>
              <th className="px-2 py-1">
                <SortHeader label="Pagamento" column="paymentStatus" />
              </th>
              <th className="px-2 py-1">
                <SortHeader label="Total" column="totalAmount" />
              </th>
              <th className="px-2 py-1 text-right">
                <span className="sr-only">Detalhes</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map(booking => (
              <tr key={booking.id} className="border-t">
                <td className="px-4 py-1">{booking.guest.name}</td>
                <td className="px-4 py-1">{booking.unit.name}</td>
                <td className="px-4 py-1">
                  {dayjs(booking.startDate).format('DD/MM/YYYY')} -{' '}
                  {dayjs(booking.endDate).format('DD/MM/YYYY')}
                </td>
                <td className="px-4 py-1">{booking.numberOfPeople}</td>
                <td className="px-4 py-1">
                  <Badge className={STATUS_COLORS[booking.status]}>
                    {STATUS_LABELS[booking.status]}
                  </Badge>
                </td>
                <td className="px-4 py-1">
                  <Badge
                    className={STATUS_PAYMENT_COLORS[booking.paymentStatus]}
                  >
                    {STATUS_PAYMENT_LABELS[booking.paymentStatus]}
                  </Badge>
                </td>
                <td className="px-4 py-1">
                  {formatCurrency(booking.totalAmount)}
                </td>
                <td className="px-4 py-1 text-right">
                  <Link
                    href={`/bookings/${booking.id}`}
                    title="Detalhes da reserva"
                  >
                    <Button size="sm" variant="outline">
                      Detalhes
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
