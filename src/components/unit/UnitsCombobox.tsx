'use client'
import { freeUnitsPerPeriod } from '@/app/(private)/(dashboard)/bookings/new/actions'
import type { Unit, UnitType } from '@/app/generated/prisma'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { FormControl } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Dayjs } from 'dayjs'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '../LoadingSpinner'

interface UnitsComboboxProps {
  value: string
  period: { startDate: Dayjs; endDate: Dayjs }
  onChange: (value: string) => void
}

interface UnitWithType extends Unit {
  type: UnitType
}

export function UnitsCombobox({ value, period, onChange }: UnitsComboboxProps) {
  const [loading, setLoading] = useState(false)
  const [units, setUnits] = useState<UnitWithType[] | null>([])
  const [unit, setUnit] = useState<UnitWithType | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function handleGetUnits() {
      setLoading(true)
      const dataUnits = await freeUnitsPerPeriod({
        from: period.startDate.toDate(),
        to: period.endDate.toDate(),
      })
      setUnits(dataUnits)
    }
    handleGetUnits().then(() => setLoading(false))
  }, [period])

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
    <Popover
      open={open}
      onOpenChange={(open: boolean) => {
        setLoading(open)
        setOpen(open)
      }}
    >
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="combobox"
            className={cn(
              'justify-between bg-popover',
              !value && 'text-muted-foreground'
            )}
            size={'sm'}
          >
            {unit
              ? `${unit.name} - ${unit.type.name}`
              : 'Selecione uma acomodação...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Procurar acomodação..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <LoadingSpinner />
              ) : (
                'Nenhuma acomodação disponível para o período selecionado.'
              )}
            </CommandEmpty>
            <CommandGroup>
              {units?.map(unit => (
                <CommandItem
                  className="form-sm"
                  value={unit.name}
                  key={unit.id}
                  onSelect={() => {
                    onChange(unit.id)
                    setUnit(unit)
                    setOpen(false)
                  }}
                >
                  {` ${unit.name}`}
                  <span className="ml-auto">{unit.type.name}</span>
                  <Check
                    className={cn(
                      'ml-auto',
                      unit.id === value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
