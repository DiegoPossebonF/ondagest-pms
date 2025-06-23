'use client'

import { Badge } from '@/components/ui/badge'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_PAYMENT_COLORS,
  STATUS_PAYMENT_LABELS,
  formatCurrency,
  padNumber,
} from '@/lib/utils'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { useBookingFilters } from './BookingFiltersProvider'
import BookingListFooter from './BookingListFooter'
import BookingsFilters from './BookingsFilters'
import { BookingsListMobile } from './BoookingListMobile'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.locale('pt-br')

export function BookingsList() {
  const router = useRouter()
  const { bookings, SortHeader } = useBookingFilters()

  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="space-y-4 mb-4">
        <BookingsListMobile />
        <BookingListFooter />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <BookingsFilters />
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-muted text-left">
            <TableRow>
              <TableHead className="px-2 py-1">
                <SortHeader label="Nº da reserva" column="id" />
              </TableHead>
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
                    {padNumber(booking.id, 5)}
                  </TableCell>
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
      <BookingListFooter />
    </div>
  )
}
