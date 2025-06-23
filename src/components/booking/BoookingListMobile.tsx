import {
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_PAYMENT_COLORS,
  STATUS_PAYMENT_LABELS,
  padNumber,
} from '@/lib/utils'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '../ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { useBookingFilters } from './BookingFiltersProvider'
import BookingsFilters from './BookingsFilters'

export function BookingsListMobile() {
  const router = useRouter()
  const { bookings, SortHeader } = useBookingFilters()
  return (
    <div className="border overflow-x-auto">
      <Table className="w-full text-sm">
        <TableHeader className="bg-muted text-left border-b-4">
          <TableRow>
            <TableHead className="p-4">
              <BookingsFilters />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map(booking => (
            <TableRow key={booking.id} className="border-b-4">
              <TableCell className="p-0">
                <div className="flex flex-row overflow-hidden">
                  <div className="min-w-[120px] flex flex-col border-r bg-muted">
                    <div className="border-b">
                      <SortHeader label="Nº da reserva" column="id" />
                    </div>
                    <div className="border-b">
                      <SortHeader label="Hóspede" column="guest" />
                    </div>
                    <div className="border-b">
                      <SortHeader label="Acomodação" column="unit" />
                    </div>
                    <div className="border-b">
                      <SortHeader label="Período" column="startDate" />
                    </div>
                    <div className="border-b">
                      <SortHeader label="Pessoas" column="numberOfPeople" />
                    </div>
                    <div className="border-b py-[2.8px]">
                      <SortHeader label="Status" column="status" />
                    </div>
                    <div className="border-b py-[2.8px]">
                      <SortHeader label="Pagamento" column="paymentStatus" />
                    </div>
                    <div>
                      <SortHeader label="Total" column="totalAmount" />
                    </div>
                  </div>
                  <Link
                    href={`/bookings/${booking.id}`}
                    className="w-full flex flex-col text-xs"
                  >
                    <div className="text-right border-b p-2 bg-muted hover:text-secondary">
                      {padNumber(booking.id, 5)}
                    </div>
                    <p className="text-right border-b p-2">
                      {booking.guest?.name || 'N/A'}
                    </p>
                    <p className="text-right border-b p-2">
                      {booking.unit?.name || 'N/A'}
                    </p>
                    <p className="text-right border-b p-2">
                      {dayjs(booking.startDate).format('DD/MM/YYYY')} -{' '}
                      {dayjs(booking.endDate).format('DD/MM/YYYY')}
                    </p>
                    <p className="text-right border-b p-2">
                      {booking.numberOfPeople || 0}
                    </p>
                    <div className="text-right border-b p-2">
                      {booking.status ? (
                        <Badge className={STATUS_COLORS[booking.status]}>
                          {STATUS_LABELS[booking.status]}
                        </Badge>
                      ) : (
                        'N/A'
                      )}
                    </div>
                    <div className="text-right border-b p-2">
                      {booking.paymentStatus ? (
                        <Badge
                          className={
                            STATUS_PAYMENT_COLORS[booking.paymentStatus]
                          }
                        >
                          {STATUS_PAYMENT_LABELS[booking.paymentStatus]}
                        </Badge>
                      ) : (
                        'N/A'
                      )}
                    </div>
                    <p className="text-right p-2">
                      {booking.totalAmount.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
