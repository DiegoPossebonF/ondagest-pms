'use client'
import type { BookingAllIncludes } from '@/types/booking'
import type { UnitWithType } from '@/types/unit'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { cn } from '@/lib/utils'
import isBetween from 'dayjs/plugin/isBetween'
import { CalendarIcon, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { BookingSheet } from './BookingSheet'
import { BookingsCardMap } from './BookingsCardMap'

dayjs.locale('pt-br')
dayjs.extend(isBetween)

const DAYS_RANGE = 30
const COLUMN_WIDTH = 64 // 4rem = 64px
const UH_COLUMN_WIDTH = 160 // Largura da coluna UH (10rem = 160px)

export function BookingsMap() {
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
    <>
      <div className="flex items-center justify-center mb-6">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'justify-start text-left font-normal',
                !startDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                <div>
                  {`A partir de `}
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
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="overflow-x-auto border-2">
        {/* Cabeçalho */}
        <div className="flex flex-nowrap">
          <div className="min-w-[160px] h-14 bg-gray-900 p-2 flex items-center justify-center border text-blue-200 font-semibold">
            <span>UH</span>
          </div>
          {dates.map(date => (
            <div
              key={date.day}
              className="max-w-16 min-w-16 h-14 bg-blue-200 p-2 flex flex-col items-center justify-center border text-gray-800 font-semibold text-sm"
            >
              <span>{date.day}</span>
              <span className="text-xs">{date.week}</span>
            </div>
          ))}
        </div>

        {/* Linhas das Unidades + Reservas */}
        {units.map(unit => (
          <div key={unit.id} className="flex flex-nowrap border-b relative">
            {/* Nome da Unidade */}
            <div className="min-w-[160px] h-10 bg-gray-800 p-2 flex items-center justify-center border text-blue-200 font-semibold z-10">
              {unit.name}
            </div>

            {/* Células de Dias */}
            <div className="relative flex w-full">
              {dates.map(date => {
                const isDateInBooking = bookings.some(booking => {
                  const start = dayjs(booking.startDate).startOf('day')
                  const end = dayjs(booking.endDate).startOf('day')
                  const checkDate = dayjs(date.fullDate, 'YYYY-MM-DD').startOf(
                    'day'
                  ) // Certifica que é um objeto dayjs válido

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
                  ? 'justify-start pl-2'
                  : isEndDate
                    ? 'justify-end pr-2'
                    : 'justify-center'

                return (
                  <div
                    key={date.day}
                    className={`flex items-center max-w-16 min-w-16 h-10 border ${plusAlignment}`}
                  >
                    {!isDateInBooking && (
                      <BookingSheet
                        startDate={date.fullDate}
                        setBookings={setBookings}
                      >
                        <Plus strokeWidth={1} size={14} />
                      </BookingSheet>
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

                  if (startIndex === -1) {
                    startIndex = 0
                    startIcon = false
                    startDiagonal = false
                  } // Começa no primeiro dia visível

                  if (endIndex === -1) {
                    endIndex = dates.length - 1
                    endIcon = false
                    endDiagonal = false
                  } // Termina no último dia visível

                  // Garante que a reserva tenha pelo menos 1 dia de largura
                  if (endIndex < startIndex) return null

                  // 🟢 Correção: Ajustamos o deslocamento de `left` corretamente

                  if (
                    startIndex === 0 &&
                    !dayjs(booking.startDate).isSame(startDate)
                  ) {
                    left =
                      UH_COLUMN_WIDTH + (startIndex - 2) * COLUMN_WIDTH - 28
                  } else {
                    left =
                      UH_COLUMN_WIDTH + (startIndex - 2) * COLUMN_WIDTH - 10
                  }

                  if (endIndex === dates.length - 1) {
                    width = (endIndex - startIndex) * COLUMN_WIDTH + 47
                  } else {
                    width = (endIndex - startIndex) * COLUMN_WIDTH + 15

                    if (
                      startIndex === 0 &&
                      !dayjs(booking.startDate).isSame(startDate)
                    ) {
                      width = (endIndex - startIndex) * COLUMN_WIDTH + 32
                    }
                  }

                  return (
                    <BookingsCardMap
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
    </>
  )
}
