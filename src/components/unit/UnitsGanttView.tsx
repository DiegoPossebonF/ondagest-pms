'use client'
import type { BookingAllIncludes } from '@/types/booking'
import type { UnitWithType } from '@/types/unit'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { cn } from '@/lib/utils'
import {
  IconCalendarWeekFilled,
  IconPlus,
  IconRewindBackward5,
  IconRewindBackward30,
  IconRewindForward5,
  IconRewindForward30,
} from '@tabler/icons-react'
import isBetween from 'dayjs/plugin/isBetween'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { UnitBookingCardView } from './UnitBookingCardView'

dayjs.locale('pt-br')
dayjs.extend(isBetween)

const DAYS_RANGE = 30
const COLUMN_WIDTH = 48

export function UnitsGanttView() {
  const [open, setOpen] = useState(false)
  const [units, setUnits] = useState<UnitWithType[]>([])
  const [bookings, setBookings] = useState<BookingAllIncludes[]>([])
  const [startDate, setStartDate] = useState<Date>(
    dayjs().startOf('day').toDate()
  )

  useEffect(() => {
    const periodDateRange = {
      from: startDate,
      to: dayjs(startDate)
        .add(DAYS_RANGE - 1, 'day')
        .toDate(),
    }
    const fetchData = async () => {
      const response = await fetch(
        `/api/booking/map/${JSON.stringify(periodDateRange)}`,
        { method: 'GET' }
      )
      const data = await response.json()
      setUnits(data.units)
      setBookings(data.bookings)
    }

    fetchData()
  }, [startDate])

  const dates = Array.from({ length: DAYS_RANGE }).map((_, index) => ({
    week: dayjs(startDate).add(index, 'day').format('ddd'),
    day: dayjs(startDate).add(index, 'day').format('DD/MM'),
    fullDate: dayjs(startDate).add(index, 'day'),
  }))

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <Button
          variant={'outline'}
          size={'icon'}
          className={cn(
            'flex-1 text-left font-normal border-b-0 rounded-b-none rounded-r-none bg-sidebar hover:bg-background',
            !startDate && 'text-muted-foreground'
          )}
          onClick={() => {
            setStartDate(dayjs(startDate).subtract(30, 'day').toDate())
          }}
        >
          <IconRewindBackward30 className="h-5 w-5" />
        </Button>
        <Button
          variant={'outline'}
          className={cn(
            'flex-1 text-left font-normal border-0 border-t border-r rounded-r-none rounded-l-none bg-sidebar hover:bg-background',
            !startDate && 'text-muted-foreground'
          )}
          size={'icon'}
          onClick={() => {
            setStartDate(dayjs(startDate).subtract(5, 'day').toDate())
          }}
        >
          <IconRewindBackward5 className="h-5 w-5" />
        </Button>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'flex-1 text-left font-normal border-0 border-t rounded-r-none rounded-l-none bg-sidebar hover:bg-background',
                !startDate && 'text-muted-foreground'
              )}
            >
              <IconCalendarWeekFilled className="h-5 w-5" />
              {startDate ? (
                <div className="text-xs">
                  <span className="font-semibold">
                    {dayjs(startDate).format('DD/MM/YYYY')}
                  </span>
                </div>
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={date => {
                if (date) {
                  setStartDate(date)
                }
                setOpen(false)
              }}
              month={startDate} // <- força a visualização começar no mês da data
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button
          variant={'outline'}
          className={cn(
            'flex-1 text-left font-normal border-b-0 border-r-0 rounded-b-none rounded-l-none rounded-r-none bg-sidebar hover:bg-background',
            !startDate && 'text-muted-foreground'
          )}
          size={'icon'}
          onClick={() => {
            setStartDate(dayjs(startDate).add(5, 'day').toDate())
          }}
        >
          <IconRewindForward5 className="h-5 w-5" />
        </Button>
        <Button
          variant={'outline'}
          className={cn(
            'flex-1 text-left font-normal border-b-0 rounded-b-none rounded-l-none bg-sidebar hover:bg-background',
            !startDate && 'text-muted-foreground'
          )}
          size={'icon'}
          onClick={() => {
            setStartDate(dayjs(startDate).add(30, 'day').toDate())
          }}
        >
          <IconRewindForward30 className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex overflow-hidden z-50 border rounded-br-md rounded-bl-md">
        <div className="flex flex-col bg-primary">
          <div className="border-b border-r text-primary-foreground min-w-28 h-10 p-2 flex items-center justify-center ">
            <h4 className="text-xs font-semibold">Acomodações</h4>
          </div>

          {/* Nome da Unidade */}
          {units.map(unit => (
            <div
              key={unit.id}
              className="border-b border-r text-primary-foreground text-xs font-semibold min-w-28 h-8 p-2 flex items-center justify-center z-10"
            >
              {unit.name}
            </div>
          ))}
        </div>
        <div className="flex flex-col overflow-auto">
          {/* Cabeçalho datas*/}
          <div className="flex flex-nowrap">
            {dates.map((date, index) => (
              <div
                key={date.day}
                className={`bg-sidebar/80 ${dates.length === index + 1 ? 'border-b' : 'border-r border-b'} min-w-12 h-10 p-2 flex flex-col items-center justify-center text-xs`}
              >
                <span className="text-xs">{date.day}</span>
                <span className="text-xs font-semibold">{date.week}</span>
              </div>
            ))}
          </div>

          {/* Linhas das Unidades + Reservas */}
          {units.map(unit => (
            <div key={unit.id} className="flex flex-nowrap relative">
              {/* Células de Dias */}
              <div className="relative flex w-full">
                {dates.map((date, index) => {
                  const isDateInBooking = bookings.some(booking => {
                    const start = dayjs(booking.startDate).startOf('day')
                    const end = dayjs(booking.endDate).startOf('day')
                    const checkDate = dayjs(
                      date.fullDate,
                      'YYYY-MM-DD'
                    ).startOf('day') // Certifica que é um objeto dayjs válido

                    return (
                      checkDate.isBetween(start, end, 'day', '()') && // '[]' inclui os extremos
                      booking.unitId === unit.id
                    )
                  })

                  const isStartDate = bookings.some(
                    booking =>
                      dayjs(date.fullDate).isSame(
                        dayjs(booking.startDate),
                        'day'
                      ) && booking.unitId === unit.id
                  )

                  const isEndDate = bookings.some(
                    booking =>
                      dayjs(date.fullDate).isSame(
                        dayjs(booking.endDate),
                        'day'
                      ) && booking.unitId === unit.id
                  )

                  const plusAlignment = isStartDate
                    ? 'mr-6'
                    : isEndDate
                      ? 'ml-6'
                      : ''

                  return (
                    <div
                      key={date.day}
                      className={`${dates.length === index + 1 ? 'border-b' : 'border-r border-b'} ${date.week === 'dom' || date.week === 'sáb' ? 'bg-sidebar' : 'bg-card'} flex items-center min-w-12 w-full h-8`}
                    >
                      {!isDateInBooking && (
                        <Link href={`/bookings/new`} className="w-full">
                          <Button
                            variant={'ghost'}
                            size={'sm'}
                            className="rounded-none w-full"
                          >
                            <IconPlus className={`h-3 w-3 ${plusAlignment}`} />
                          </Button>
                        </Link>
                      )}
                    </div>
                  )
                })}

                {/* Reservas */}
                {bookings
                  .filter(booking => booking.unitId === unit.id)
                  .map(booking => {
                    const start = dayjs(booking.startDate).format('YYYY-MM-DD')
                    const end = dayjs(booking.endDate).format('YYYY-MM-DD')

                    let left = 0
                    let width = 0
                    let startIcon = true
                    let endIcon = true
                    let startDiagonal = true
                    let endDiagonal = true

                    // Encontrar índices das datas dentro do array de dias
                    let startIndex = dates.findIndex(
                      d => d.fullDate.format('YYYY-MM-DD') === start
                    )
                    let endIndex = dates.findIndex(
                      d => d.fullDate.format('YYYY-MM-DD') === end
                    )

                    //console.log('D-1:', startIndex, endIndex)

                    if (startIndex === -1) {
                      startIndex = 0
                      endIndex = endIndex + 1
                      startIcon = false
                      startDiagonal = false
                    } // Começa no primeiro dia visível

                    if (endIndex === -1) {
                      endIndex = dates.length
                      endIcon = false
                      endDiagonal = false
                    } // Termina no último dia visível

                    //console.log('D-2:', startIndex, endIndex)

                    // Garante que a reserva tenha pelo menos 1 dia de largura
                    if (endIndex < startIndex) return null

                    left = startIndex * COLUMN_WIDTH
                    width = (endIndex - startIndex) * COLUMN_WIDTH

                    if (startIndex !== 0 && endIndex !== 0) {
                      left = left + 17
                      width = width + 15
                    }

                    if (startIndex === 0) {
                      width = width + 17
                      left = left + 15
                    }

                    if (
                      startIndex === 0 &&
                      !dayjs(startDate).isSame(booking.startDate, 'day')
                    ) {
                      left = left - 15
                      width = width - 32
                    }

                    if (endIndex === dates.length) width = width - 32

                    return (
                      <UnitBookingCardView
                        key={booking.id}
                        booking={booking}
                        positionLeft={`${left}px`}
                        widthCard={`${width}px`}
                        startIcon={startIcon}
                        endIcon={endIcon}
                        startDiagonal={startDiagonal}
                        endDiagonal={endDiagonal}
                      />
                    )

                    //return null
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
