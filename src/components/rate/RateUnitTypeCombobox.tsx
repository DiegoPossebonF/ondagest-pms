'use client'
import { getUnitTypes } from '@/app/actions/unitType/actions'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { UnitType } from '@prisma/client'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export function RateUnitTypeCombobox({
  unitTypeId,
  onChange,
}: { unitTypeId: string; onChange: (value: string | null) => void }) {
  const [unitTypes, setUnitTypes] = useState<UnitType[] | null>([])
  const [selectedUnitType, setSelectedUnitType] = useState<UnitType | null>(
    null
  )
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function handleGetUnitTypes() {
      const { data, error, success } = await getUnitTypes()
      if (error) {
        console.log(error)
        return
      }
      if (data) {
        setUnitTypes(data)
      }
    }
    handleGetUnitTypes()
  }, [])

  useEffect(() => {
    if (!unitTypes) {
      setSelectedUnitType(null)
      return
    }
    setSelectedUnitType(
      unitTypes.find(unitType => unitType.id === unitTypeId) || null
    )
  }, [unitTypeId, unitTypes])

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
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          className={cn(
            'justify-between text-xs h-8 px-3 bg-white dark:bg-muted',
            !selectedUnitType && 'text-muted-foreground'
          )}
          size={'sm'}
        >
          {selectedUnitType
            ? `${selectedUnitType.name}`
            : 'Selecione um tipo de acomodação...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Procurar acomodação..." className="h-9" />
          <CommandList>
            <CommandEmpty>Nenhuma acomodação encontrada</CommandEmpty>
            <CommandGroup>
              {unitTypes?.map(type => (
                <CommandItem
                  className="form-sm"
                  value={type.name}
                  key={type.id}
                  onSelect={e => {
                    setSelectedUnitType(type)
                    onChange(type.id)
                    setOpen(false)
                  }}
                >
                  {`${type.name}`}
                  <Check
                    className={cn(
                      'ml-auto',
                      type.id === selectedUnitType?.id
                        ? 'opacity-100'
                        : 'opacity-0'
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
