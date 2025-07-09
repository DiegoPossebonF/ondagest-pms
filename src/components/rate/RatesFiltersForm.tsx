'use client'
import { Input } from '@/components/ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { RateUnitTypeCombobox } from './RateUnitTypeCombobox'
import type { Filters } from './RatesFiltersProvider'

export function RatesFiltersForm({
  filters,
  onChange,
}: {
  filters: Filters
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onChange: (key: keyof Filters, value: any) => void
}) {
  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-3 pb-4 z-50">
      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          name="name"
          placeholder="Buscar nome"
          value={filters.name}
          onChange={e => onChange('name', e.target.value)}
          className="text-xs h-8 px-3 bg-white dark:bg-muted"
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <RateUnitTypeCombobox
          unitTypeId={filters.typeId ?? ''}
          onChange={(value: string | null) => onChange('typeId', value)}
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="value">Valor</Label>
        <Input
          name="value"
          placeholder="Buscar por valor"
          value={Number(filters.value)}
          onChange={e => onChange('value', Number(e.target.value))}
          className="text-xs h-8 px-3 bg-white dark:bg-muted"
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="email">Pessoas</Label>
        <Input
          name="numberOfPeople"
          placeholder="Buscar por pessoas"
          value={Number(filters.numberOfPeople)}
          onChange={e => onChange('numberOfPeople', Number(e.target.value))}
          className="text-xs h-8 px-3 bg-white dark:bg-muted"
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="active">Somente ativos</Label>
        <Select
          name="active"
          defaultValue={filters.active ? 'true' : 'false'}
          value={filters.active ? 'true' : 'false'}
          onValueChange={value => onChange('active', value === 'true')}
        >
          <SelectTrigger className="w-full text-xs h-8 px-3 bg-white dark:bg-muted">
            <SelectValue placeholder="Somente ativos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-xs h-8" value="true">
              Sim
            </SelectItem>
            <SelectItem className="text-xs h-8" value="false">
              Não
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
