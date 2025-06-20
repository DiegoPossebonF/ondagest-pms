'use client'

import { freeUnitsPerPeriod } from '@/app/actions/unit/actions'
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
import { Check, ChevronsUpDown } from 'lucide-react'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { LoadingSpinner } from '../LoadingSpinner'

interface UnitWithType extends Unit {
  type: UnitType
}

interface UnitsComboboxProps {
  bookingId?: number
  selectedUnit: UnitWithType | null
  setSelectedUnit: Dispatch<SetStateAction<UnitWithType | null>>
  period: {
    from: Date
    to: Date
  }
  onChange: (value: string) => void
  disabled?: boolean
}

export function UnitsCombobox({
  bookingId,
  selectedUnit,
  setSelectedUnit,
  period,
  onChange,
  disabled,
}: UnitsComboboxProps) {
  const [loading, setLoading] = useState(false)
  const [units, setUnits] = useState<UnitWithType[] | null>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    async function handleGetUnits() {
      setLoading(true)
      const availableUnits = await freeUnitsPerPeriod(
        period,
        bookingId // 👈 passa aqui o ID da unidade atual
      )
      setUnits(availableUnits)
    }
    handleGetUnits().then(() => setLoading(false))
  }, [period, bookingId, open])

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
              !selectedUnit && 'text-muted-foreground'
            )}
            size={'sm'}
            disabled={disabled}
          >
            {selectedUnit
              ? `${selectedUnit.name} - ${selectedUnit.type.name}`
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
              ) : units?.length === 0 || !units ? (
                <span>
                  Nenhuma acomodação disponível para o período selecionado.
                </span>
              ) : (
                <span>Nenhuma acomodação localizada. </span>
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
                    setSelectedUnit(unit)
                    setOpen(false)
                  }}
                >
                  {`${unit.name} - ${unit.type.name}`}
                  <Check
                    className={cn(
                      'ml-auto',
                      unit.id === selectedUnit?.id ? 'opacity-100' : 'opacity-0'
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
