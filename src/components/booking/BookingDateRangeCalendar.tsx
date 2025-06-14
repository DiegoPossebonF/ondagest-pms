'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ptBR } from 'date-fns/locale'
import dayjs from 'dayjs'
import { ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { UseFormSetValue } from 'react-hook-form'
import type { NewBookingFormValues } from './NewBookingForm'

interface BookingDateRangeCalendarProps {
  value: {
    startDate: dayjs.Dayjs
    endDate: dayjs.Dayjs
  }
  setValue: UseFormSetValue<NewBookingFormValues>
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
          {value?.startDate && value?.endDate
            ? `${value.startDate.format('DD/MM/YYYY')} - ${value.endDate.format('DD/MM/YYYY')}`
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
            from: value?.startDate.toDate(),
            to: value?.endDate.toDate(),
          }}
          onSelect={range => {
            setValue('dateRangeSchema', {
              startDate: dayjs(range?.from),
              endDate: dayjs(range?.to),
            })
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
