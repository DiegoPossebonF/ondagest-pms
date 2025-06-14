'use client'
import { getUnitsByPeriod } from '@/actions/unit/getUnitsByPeriod'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Rate } from '@/types/rate'
import type { UnitWithTypeAndBookings } from '@/types/unitTypes'
import { Check, ChevronsUpDown } from 'lucide-react'
import { type Dispatch, type SetStateAction, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import type { UseFormSetValue } from 'react-hook-form'
import { LoadingSpinner } from '../LoadingSpinner'
import type { BookingFormValues } from '../booking/BookingForm'
import { FormControl } from '../ui/form'

interface UnitComboboxProps {
  setValue: UseFormSetValue<BookingFormValues>
  setRates: Dispatch<SetStateAction<Rate[]>>
  unitId: string
  unitName?: string
  period: DateRange
  bookingId?: number
}

export function UnitCombobox({
  setValue,
  setRates,
  period,
  unitId,
  unitName,
  bookingId,
}: UnitComboboxProps) {
  const [loadind, setLoading] = useState(false)
  const [openPopover, setOpenPopover] = useState(false)
  const [units, setUnits] = useState<UnitWithTypeAndBookings[]>([])
  const [selectedUnitName, setSelectedUnitName] = useState(unitName || '')

  async function handleGetUnits(period: DateRange) {
    try {
      setLoading(true)
      if (period) {
        const units: UnitWithTypeAndBookings[] = await getUnitsByPeriod(
          period,
          bookingId || 0
        )
        return units
      }

      return [] as UnitWithTypeAndBookings[]
    } catch {
      return [] as UnitWithTypeAndBookings[]
    } finally {
      setTimeout(() => setLoading(false), 1000)
    }
  }

  function handleSelect(unit: UnitWithTypeAndBookings) {
    setValue('unitId', unit.id)
    setSelectedUnitName(unit.name)
    setRates(unit.type.rates)
    setOpenPopover(false)
  }

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="combobox"
            className={cn(
              'w-full justify-between',
              !unitId && 'text-muted-foreground'
            )}
            onClick={async () => {
              const units = await handleGetUnits({
                from: period.from,
                to: period.to,
              })
              setUnits(units)
            }}
          >
            {selectedUnitName ? selectedUnitName : 'Selecione uma unidade...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="min-w-[var(--radix-popper-anchor-width)]  p-0">
        <Command>
          <CommandList>
            {loadind ? (
              <div className="flex items-center justify-center p-4">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              <CommandGroup>
                <CommandEmpty>
                  Nenhuma unidade livre nesse periodo!
                </CommandEmpty>
                {units?.map(unit => (
                  <CommandItem
                    value={unit.name}
                    key={unit.id}
                    onSelect={() => {
                      handleSelect(unit)
                    }}
                  >
                    {unit.name}
                    <Check
                      className={cn(
                        'ml-auto',
                        unit.id === unitId ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
