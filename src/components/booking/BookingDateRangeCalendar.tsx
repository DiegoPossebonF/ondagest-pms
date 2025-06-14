'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { BookingSchema } from '@/schemas/booking-schema'
import { ptBR } from 'date-fns/locale'
import dayjs from 'dayjs'
import { ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { UseFormSetValue } from 'react-hook-form'

interface BookingDateRangeCalendarProps {
  value: {
    from: Date
    to: Date
  }
  setValue: UseFormSetValue<BookingSchema>
}

export function BookingDateRangeCalendar({
  value,
  setValue,
}: BookingDateRangeCalendarProps) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (open) {
      // Retira o foco do elemento automaticamente focado
      requestAnimationFrame(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      })
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-between font-normal bg-popover"
          size={'sm'}
        >
          {value?.from && value?.to
            ? `${dayjs(value.from).format('DD/MM/YYYY')} - ${dayjs(value.to).format('DD/MM/YYYY')}`
            : 'Selecione o período da reserva'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          locale={ptBR}
          captionLayout="dropdown"
          selected={{
            from: value?.from,
            to: value?.to,
          }}
          onSelect={range => {
            setValue('period', {
              from: range?.from as Date,
              to: range?.to as Date,
            })
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
