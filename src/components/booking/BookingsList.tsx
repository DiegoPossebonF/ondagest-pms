'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import 'dayjs/locale/pt-br'
import { getBookings } from '@/app/actions/booking/actions'
import type { BookingStatus, PaymentStatus } from '@/app/generated/prisma'
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
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { BookingsFilters } from './BookingsFilters'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

dayjs.locale('pt-br')

type SortKey =
  | 'guest'
  | 'unit'
  | 'startDate'
  | 'numberOfPeople'
  | 'status'
  | 'paymentStatus'
  | 'totalAmount'

type SortDirection = 'asc' | 'desc'

export function BookingsList() {
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [bookings, setBookings] = useState<BookingAllIncludes[]>([])

  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [activeFilters, setActiveFilters] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>('startDate')
  const perPage = 10

  const [filters, setFilters] = useState({
    guestName: '',
    unitName: '',
    status: '' as BookingStatus,
    paymentStatus: '' as PaymentStatus,
    startDate: null,
    endDate: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      const result = await getBookings({
        page,
        perPage,
        sortKey,
        sortDirection,
        filters,
      })

      setBookings(result.data)
      setTotalPages(result.totalPages)
    }

    fetchData()
  }, [page, sortKey, sortDirection, filters])

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
                  status: '' as BookingStatus,
                  paymentStatus: '' as PaymentStatus,
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

        {bookings.map(booking => (
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
                status: '' as BookingStatus,
                paymentStatus: '' as PaymentStatus,
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
        <Table className="w-full text-sm">
          <TableHeader className="bg-muted text-left">
            <TableRow>
              <TableHead className="px-2 py-1">
                <SortHeader label="Hóspede" column="guest" />
              </TableHead>
              <TableHead className="px-2 py-1">
                <SortHeader label="Acomodação" column="unit" />
              </TableHead>
              <TableHead className="px-2 py-1">
                <SortHeader label="Período" column="startDate" />
              </TableHead>
              <TableHead className="px-2 py-1">
                <SortHeader label="Pessoas" column="numberOfPeople" />
              </TableHead>
              <TableHead className="px-2 py-1">
                <SortHeader label="Status" column="status" />
              </TableHead>
              <TableHead className="px-2 py-1">
                <SortHeader label="Pagamento" column="paymentStatus" />
              </TableHead>
              <TableHead className="px-2 py-1">
                <SortHeader label="Total" column="totalAmount" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {bookings.length > 0 ? (
              bookings.map(booking => (
                <TableRow
                  key={booking.id}
                  className="cursor-pointer border-t"
                  onClick={() => {
                    router.push(`/bookings/${booking.id}`)
                  }}
                >
                  <TableCell className="px-4 py-2">
                    {booking.guest.name}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {booking.unit.name}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {dayjs(booking.startDate).format('DD/MM/YYYY')} -{' '}
                    {dayjs(booking.endDate).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {booking.numberOfPeople}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge className={STATUS_COLORS[booking.status]}>
                      {STATUS_LABELS[booking.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge
                      className={STATUS_PAYMENT_COLORS[booking.paymentStatus]}
                    >
                      {STATUS_PAYMENT_LABELS[booking.paymentStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {formatCurrency(booking.totalAmount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Nenhuma reserva encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Página {page} de {totalPages || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
