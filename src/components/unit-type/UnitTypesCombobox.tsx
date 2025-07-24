'use client'
import { getUnitTypes } from '@/app/actions/unitType/actions'
import type { UnitType } from '@/app/generated/prisma'
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
import { useEffect, useState } from 'react'

export function UnitTypesCombobox({
  unitTypeId,
  onChange,
}: { unitTypeId: string; onChange: (value: string) => void }) {
  const [unitTypes, setUnitTypes] = useState<UnitType[] | null>([])
  const [selectedUnitType, setSelectedUnitType] = useState<UnitType | null>(
    null
  )
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function handleGetUnitTypes() {
      const res = await getUnitTypes()
      if (res.error) {
        console.log(res.error)
        return
      }
      if (res.data) {
        setUnitTypes(res.data)
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
        <FormControl>
          <Button
            variant="outline"
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="combobox"
            className={cn(
              'justify-between bg-popover',
              !selectedUnitType && 'text-muted-foreground'
            )}
            size={'sm'}
          >
            {selectedUnitType
              ? `${selectedUnitType.name}`
              : 'Selecione um tipo de acomodação...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Procurar acomodação..." className="h-9" />
          <CommandList>
            <CommandEmpty className="flex flex-col gap-2 p-2">
              <p className="text-sm text-muted-foreground text-center">
                Nenhum tipo de acomodação encontrado
              </p>
              <Button className="w-full" variant={'secondary'} size={'sm'}>
                <a href="/settings/unit_types">Novo tipo de acomodação</a>
              </Button>
            </CommandEmpty>
            <CommandGroup
              className={`${unitTypes && unitTypes.length > 0 ? 'p-2' : 'p-0'}`}
            >
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
