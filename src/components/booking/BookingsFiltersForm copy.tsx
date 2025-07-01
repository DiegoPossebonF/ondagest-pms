'use client'

import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { STATUS_LABELS, STATUS_PAYMENT_LABELS, cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import type { Filters } from './BookingsFiltersProvider'

export function BookingsFiltersForm({
  filters,
  onChange,
}: {
  filters: Filters
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onChange: (key: keyof Filters, value: any) => void
}) {
  const range: DateRange = {
    from: filters.startDate ?? undefined,
    to: filters.endDate ?? undefined,
  }

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-3 pb-4 z-50">
      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="guestName">Nº da reserva</Label>
        <Input
          name="id"
          type="number"
          placeholder="Buscar por Nº da reserva"
          value={filters.id}
          onChange={e => onChange('id', e.target.value)}
        />
      </div>
      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="guestName">Hóspede</Label>
        <Input
          name="guestName"
          placeholder="Buscar hóspede"
          value={filters.guestName}
          onChange={e => onChange('guestName', e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="unitName">Acomodação</Label>
        <Input
          name="unitName"
          placeholder="Buscar acomodação"
          value={filters.unitName}
          onChange={e => onChange('unitName', e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="booking">Reserva</Label>
        <Select
          name="booking"
          value={filters.status}
          onValueChange={value => onChange('status', value)}
        >
          <SelectTrigger className={'h-8 rounded-md px-3 text-xs bg-popover'}>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent className="z-50">
            <SelectItem value="ALL">Todos</SelectItem>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="payment">Pagamento</Label>
        <Select
          name="payment"
          value={filters.paymentStatus}
          onValueChange={value => onChange('paymentStatus', value)}
        >
          <SelectTrigger className={'h-8 rounded-md px-3 text-xs bg-popover'}>
            <SelectValue placeholder="Pagamento" />
          </SelectTrigger>
          <SelectContent className="z-50">
            <SelectItem value="ALL">Todos</SelectItem>
            {Object.entries(STATUS_PAYMENT_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="period">Período</Label>
        <Popover>
          <PopoverTrigger asChild name="period">
            <Button
              variant={'outline'}
              size={'sm'}
              className={cn(
                'flex items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm',
                !range.from && 'text-muted-foreground'
              )}
            >
              <span>
                {range.from
                  ? range.to
                    ? `${format(range.from, 'dd/MM/yyyy')} - ${format(range.to, 'dd/MM/yyyy')}`
                    : format(range.from, 'dd/MM/yyyy')
                  : 'Selecionar período'}
              </span>
              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="range"
              locale={ptBR}
              captionLayout="dropdown"
              selected={range}
              onSelect={range => {
                onChange('startDate', range?.from ?? null)
                onChange('endDate', range?.to ?? null)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
