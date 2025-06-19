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
  period: {
    from: Date
    to: Date
  }
  setValue: UseFormSetValue<BookingSchema>
  disabled?: boolean
}

export function BookingDateRangeCalendar({
  period,
  setValue,
  disabled,
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
          disabled={disabled}
        >
          {period?.from && period?.to
            ? `${dayjs(period.from).format('DD/MM/YYYY')} - ${dayjs(period.to).format('DD/MM/YYYY')}`
            : 'Selecione o período da reserva'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          locale={ptBR}
          captionLayout="dropdown"
          selected={period}
          onSelect={range => {
            if (range?.from && range.to) {
              setValue('period', { from: range.from, to: range.to })
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
