'use client'

import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import type { UseFormSetValue } from 'react-hook-form'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import type { BookingFormValues } from './BookingForm'

interface BookingCalendarProps {
  setValue: UseFormSetValue<BookingFormValues>
  period: DateRange
}

export function BookingCalendar({ setValue, period }: BookingCalendarProps) {
  const [open, setOpen] = useState(false)
  const isSecondDateSelected = period.to !== undefined
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={'bookingform'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !period.from && 'text-muted-foreground'
          )}
        >
          <CalendarIcon />
          {period.from ? (
            period.to ? (
              <>
                {dayjs(period.from).format('DD/MM/YYYY')} -{' '}
                {dayjs(period.to).format('DD/MM/YYYY')}
              </>
            ) : (
              dayjs(period.from).format('DD/MM/YYYY')
            )
          ) : (
            <span>Selecione o período da reserva</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={period.from}
          selected={
            period.from
              ? period
              : {
                  from: new Date(),
                  to: new Date(),
                }
          }
          onSelect={date => {
            setValue('period', {
              from: date?.from || new Date(),
              to: date?.to,
            })

            !isSecondDateSelected && setOpen(prev => !prev)
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
