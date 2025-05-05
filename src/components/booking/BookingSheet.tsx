'use client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { BookingAllIncludes } from '@/types/booking'
import type { UnitWithTypeAndBookings } from '@/types/unit'
import type dayjs from 'dayjs'
import { useState } from 'react'
import { Separator } from '../ui/separator'
import { BookingForm } from './BookingForm'

interface BookingSheetProps {
  startDate?: dayjs.Dayjs
  unit?: UnitWithTypeAndBookings
  booking?: BookingAllIncludes
  setBookings?: React.Dispatch<React.SetStateAction<BookingAllIncludes[]>>
  children: React.ReactNode
}

export function BookingSheet({
  booking,
  children,
  startDate,
  unit,
  setBookings,
}: BookingSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={!open}>
      <SheetTrigger className="cursor-pointer" asChild>
        {children}
      </SheetTrigger>
      <SheetContent aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {booking ? 'Atualizar reserva' : 'Nova reserva'}
          </SheetTitle>
        </SheetHeader>
        <Separator className="mb-6" />
        {setBookings ? (
          <BookingForm
            booking={booking}
            setOpenSheet={setOpen}
            startDate={startDate}
            setBookings={setBookings}
          />
        ) : (
          <BookingForm
            booking={booking}
            setOpenSheet={setOpen}
            startDate={startDate}
            unit={unit}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
