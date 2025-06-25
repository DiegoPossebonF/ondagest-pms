'use client'

import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import type { Filters } from './GuestsFiltersProvider'

export function GuestsFiltersForm({
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
        <Label htmlFor="name">Hóspede</Label>
        <Input
          name="name"
          placeholder="Buscar nome"
          value={filters.name}
          onChange={e => onChange('name', e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          name="email"
          placeholder="Buscar e-mail"
          value={filters.email}
          onChange={e => onChange('email', e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          name="phone"
          placeholder="Buscar telefone"
          value={filters.phone}
          onChange={e => onChange('phone', e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          name="cpf"
          placeholder="Buscar CPF"
          value={filters.cpf}
          onChange={e => onChange('cpf', e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="carPlate">Placa do carro</Label>
        <Input
          name="carPlate"
          placeholder="Buscar placa"
          value={filters.carPlate}
          onChange={e => onChange('carPlate', e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="city">Cidade</Label>
        <Input
          name="city"
          placeholder="Buscar cidade"
          value={filters.city}
          onChange={e => onChange('city', e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="period">Período de cadastro</Label>
        <Popover>
          <PopoverTrigger asChild name="period">
            <Button
              variant={'outline'}
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
              selected={range}
              onSelect={range => {
                onChange('startDate', range?.from ?? null)
                onChange('endDate', range?.to ?? null)
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
