'use client'
import { getDifferenceInDays } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import dayjs from 'dayjs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { BookingSheet } from './BookingSheet'

interface BookingListProps {
  bookings: BookingAllIncludes[]
}
export default function BookingsTable({ bookings }: BookingListProps) {
  console.log(bookings)
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Nº</TableHead>
          <TableHead>Hóspede</TableHead>
          <TableHead>UH</TableHead>
          <TableHead>Check in</TableHead>
          <TableHead>Check out</TableHead>
          <TableHead>Nº de pessoas</TableHead>
          <TableHead>Nº de diárias</TableHead>
          <TableHead>Diária</TableHead>
          <TableHead>Valor Total</TableHead>
          <TableHead>Situação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map(booking => (
          <BookingSheet key={booking.id} booking={booking}>
            <TableRow key={booking.id}>
              <TableCell>{booking.id}</TableCell>
              <TableCell>{booking.guest.name}</TableCell>
              <TableCell>{booking.unit.name}</TableCell>
              <TableCell>
                {dayjs(booking.startDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {dayjs(booking.endDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>{booking.numberOfPeople}</TableCell>
              <TableCell>
                {getDifferenceInDays({
                  from: booking.startDate,
                  to: booking.endDate,
                })}
              </TableCell>
              <TableCell>
                {booking.totalAmount /
                  getDifferenceInDays({
                    from: booking.startDate,
                    to: booking.endDate,
                  })}
              </TableCell>
              <TableCell>{booking.totalAmount}</TableCell>
              <TableCell>{booking.status}</TableCell>
            </TableRow>
          </BookingSheet>
        ))}
      </TableBody>
    </Table>
  )
}
