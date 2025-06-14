'use client'
import type { Rate } from '@/app/generated/prisma'
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
import { cn, formatCurrency } from '@/lib/utils'
import { IconCurrencyReal, IconUserFilled } from '@tabler/icons-react'
import type { Dictionary } from 'lodash'
import { Check, ChevronsUpDown, Info } from 'lucide-react'
import { useEffect, useState } from 'react'

interface RatesComboboxProps {
  rates: Dictionary<Rate[]> | null
  selectedRateName: string | null
  onChange: (value: string) => void
  disabled?: boolean
}

export function RatesCombobox({
  rates,
  selectedRateName,
  onChange,
  disabled,
}: RatesComboboxProps) {
  const [open, setOpen] = useState(false)

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
    <div className="flex flex-row items-center gap-2">
      <Popover
        open={open}
        onOpenChange={(open: boolean) => {
          setOpen(open)
        }}
      >
        <PopoverTrigger asChild disabled={disabled}>
          <FormControl>
            <Button
              variant="outline"
              // biome-ignore lint/a11y/useSemanticElements: <explanation>
              role="combobox"
              className={cn(
                'justify-between bg-popover w-full',
                !selectedRateName && 'text-muted-foreground'
              )}
              size={'sm'}
            >
              {selectedRateName ? selectedRateName : 'Selecione uma tarifa...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Procurar tarifas..." className="h-9" />
            <CommandList>
              <CommandEmpty>{'Nenhuma tarifa encontrada'}</CommandEmpty>
              <CommandGroup>
                {rates &&
                  Object.entries(rates).map(([rate]) => (
                    <CommandItem
                      className="form-sm"
                      value={rate}
                      key={rate}
                      onSelect={() => {
                        onChange(rate)
                        setOpen(false)
                      }}
                    >
                      {rate}
                      <Check
                        className={cn(
                          'ml-auto',
                          rate === selectedRateName
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

      {/** popover info rates */}
      {selectedRateName && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="self-start">
              <Info className="w-4 h-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="space-y-3 text-xs w-40">
            {rates &&
              selectedRateName &&
              rates[selectedRateName].map(r => (
                <div
                  className="flex flex-col"
                  key={`${r.numberOfPeople}-${r.value}`}
                >
                  <div className="flex flex-row items-center justify-between gap-2">
                    <span className="flex flex-row items-center gap-1">
                      <IconUserFilled className="w-4 h-4" /> {r.numberOfPeople}
                    </span>
                    <span className="flex flex-row items-center gap-1">
                      <IconCurrencyReal className="w-4 h-4" />{' '}
                      {formatCurrency(r.value).replace('R$', '')}
                    </span>
                  </div>
                </div>
              ))}
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
